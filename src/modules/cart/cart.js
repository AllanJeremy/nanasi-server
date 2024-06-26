 const Cart = require("../../models/cart");
 const Api = require("../../lib/api");
 const FeedbackMessages = require("../../lang/feedbackMessages");

 // Get multiple cart by filter
 function _getCartsByFilter(filter, callback) {
     filter = filter || {};
     return Cart.find(filter)
         .populate("product", "name")
         .populate("user", "_id name")
         .then((cartFound) => {
             const cartCount = cartFound.length;
             const isOk = (cartCount > 0);
             const statusCode = isOk ? 200 : 404;
             const message = isOk ? FeedbackMessages.itemsFoundWithCount(cartFound, "Cart items") : FeedbackMessages.itemNotFound("Carts");

             return callback(
                 Api.getResponse(isOk, message, {
                     count: cartCount,
                     cart: cartFound
                 }, statusCode)
             );
         })
         .catch((err) => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed("get cart"), err)
             );
         });
 }

 // Get cartItem by filter
 function _getSingleCartByFilter(filter, callback) {
     return Cart.findOne(filter)
         .populate("product", "name")
         .populate("user", "firstName lastName accountType")
         .then((cartItemFound) => {
             const isOk = cartItemFound ? true : false;
             const statusCode = isOk ? 200 : 404;
             const message = isOk ? FeedbackMessages.itemsFound("Cart item") : FeedbackMessages.itemNotFound("Cart");

             return callback(
                 Api.getResponse(isOk, message, {
                     cart: cartItemFound
                 }, statusCode)
             );
         })
         .catch((err) => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed("get cart item"), err)
             );
         });
 }

 //  Create a new cart item
 function _createNewCartItem(userId, itemsToAdd, callback) {
     const cartItem = new Cart({
         items: itemsToAdd,
         user: userId
     });

     return cartItem.save().then(createdCartItem => {
         return callback(
             Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully("Cart item"), createdCartItem, 201)
         );
     }).catch((err) => {
         return callback(
             Api.getError(FeedbackMessages.operationFailed("create cart item"), err)
         );
     });
 }

 // Checks if there is a product by that id in a list of cart items ~ returns true if it does, false if not
 function _productExistsInCart(productId, cartItems) { //* Prevents duplicate cart items
     let productExists = false;
     let itemIndex;
     cartItems.map((currItem, index) => {
         productExists = (currItem.product._id == productId);
         if (productExists) { // Return true, don't bother checking
             itemIndex = index;
             return productExists;
         }
     });

     return {
         exists: productExists,
         index: itemIndex
     };
 }

 // Add item to cart
 function _addCartItems(userId, itemsToAdd, callback) { // items = [{product: <id>, quantity: <qty>}]
     Cart.findOne({
             user: userId,
             orderIsCompleted: false
         })
         .then(cartFound => {
             let cartItems = cartFound.items;

             //TODO: Check if cart item was found
             let productInCart;

             itemsToAdd.map((itemToAdd) => {
                 productInCart = _productExistsInCart(itemToAdd.product, cartItems);

                 // This specific item already exists in the cart found ~ update quantity
                 if (productInCart.exists) {
                     cartFound.items[productInCart.index].quantity = itemToAdd.quantity;
                 } else { // Item does not exist in cart, add it
                     // Product id
                     cartFound.items.push(itemToAdd);
                 }
             });

             // Save cart items to database
             cartFound.save()
                 .then(createdCartItem => {
                     return callback(
                         Api.getResponse(true, FeedbackMessages.operationSucceeded("added cart item"), createdCartItem, 201)
                     );
                 }).catch((err) => {
                     return callback(
                         Api.getError(FeedbackMessages.operationFailed("add cart item"), err)
                     );
                 });
         })
         .catch((err) => {
             if (err.errors) {
                 return callback(
                     Api.getError(err.message, err)
                 );
             }

             // Create a new cart item if there were no actual errors ~ Somehow end up in catch block when a cart item cannot be found
             _createNewCartItem(userId, itemsToAdd, callback);
         });
 }

 /* 
     EXPORTS
 */
 // Add item to cart
 module.exports.addCartItems = (userId, itemsToAdd, callback) => {
     return _addCartItems(userId, itemsToAdd, callback);
 };

 // View cart items for the current user
 module.exports.getUserCart = (userId, callback) => {
     return _getSingleCartByFilter({
         user: userId,
         orderIsCompleted: false
     }, callback);
 };

 // Update cart item ~ Often used to update the item quantity in the cart
 module.exports.updateCart = (cartItemId, updateData, callback) => {
     return Cart.findByIdAndUpdate(cartItemId, updateData).then((cartItemFound) => {
         // Check if cartItem was found
         if (cartItemFound) {
             // No errors ~ Updated the cartItem
             return callback(
                 Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully("cart item"), {
                     id: cartItemId
                 })
             );
         } else {
             return callback(
                 Api.getError(FeedbackMessages.itemNotFound("Cart item"), null, 404)
             );
         }
     }).catch((err) => {
         return callback(
             Api.getError(FeedbackMessages.operationFailed("update cart item"), err)
         );
     });
 };

 // Delete single cart item
 module.exports.deleteCart = (cartId, callback) => {
     return Cart.findByIdAndDelete(cartId).then((cartItemDeleted) => {
         if (cartItemDeleted) {
             // No errors ~ Deleted the cartItem
             return callback(
                 Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully("cart item"), {
                     id: cartId,
                     cartItemName: cartItemDeleted.name
                 })
             );
         } else {
             return callback(
                 Api.getError(FeedbackMessages.itemNotFound("Cart"), null, 404)
             );
         }
     }).catch((err) => {
         return callback(
             Api.getError(FeedbackMessages.operationFailed("delete cart item"), err)
         );
     });
 };

 module.exports.getCartTotal = (userId, callback) => { //TODO: Debug
     Cart.findOne({
             user: userId,
             orderIsCompleted: false
         })
         .populate("items.product", "regularPrice salePrice")
         .then(cartItemsFound => {
             if (cartItemsFound.length === 0) {
                 return callback(
                     Api.getError(FeedbackMessages.itemNotFound("Cart item"), null, 404)
                 );
             }

             // Calculating total cart price
             let total = 0;
             cartItemsFound.items.map((cartItem) => {
                 let productPrice = cartItem.product.salePrice || cartItem.product.regularPrice;

                 total += (cartItem.quantity * productPrice);
             });

             //* Nanasi will still retain their revenue (8% of regular price)

             return callback(
                 Api.getResponse(true, FeedbackMessages.operationSucceeded("calculated cart total"), {
                     total: total,
                     userId: cartItemsFound.user,
                     items: cartItemsFound.items
                 })
             );
         })
         .catch((err) => {
             return callback(
                 Api.getError(err.message, err)
             );
         });
 };

 // Clear buyer cart ~ we use this when we complete a checkout
 module.exports.clearUserCart = (userId, callback) => {

     const updateData = {
         orderIsCompleted: true
     };

     //TODO: Move cart contents into a separate collection
     Cart.findOneAndUpdate({
             user: userId,
             orderIsCompleted: false
         }, updateData)
         .then((cartFound) => {
             // Check if cart was found
             if (cartFound) {
                 // No errors ~ Updated the cart
                 return callback(
                     Api.getResponse(true, FeedbackMessages.operationSucceeded("cleared cart"), {
                         id: cartFound.id
                     })
                 );
             } else {
                 return callback(
                     Api.getError(FeedbackMessages.itemNotFound("cart"), null, 404)
                 );
             }
         })
         .catch((err) => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed("clear cart"), err)
             );
         });
 };

 // Delete a single cart item
 module.exports.deleteSingleCartItem = (userId, cartItemId, callback) => {
     Cart.findOne({
             user: userId,
             orderIsCompleted: false
         })
         .then((cartFound) => {
             if (!cartFound) { // If no cart was found, return 404
                 return callback(
                     Api.getError(FeedbackMessages.itemNotFound("cart"), null, 404)
                 );
             }

             // Cart was found, update it
             cartFound.items = cartFound.items.filter((itemFound) => {
                 // Return the array without the cartItem that we have removed
                 return (itemFound._id === cartItemId);
             });

             cartFound.save(); // Update the cart
             return callback(
                 Api.getResponse(true, FeedbackMessages.operationSucceeded("removed cart item"), null, 201)
             );
         })
         .catch((err) => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed("clear cart"), err)
             );
         });

 };

 /* 
    ABANDONED CARTS
 */
 // TODO: Add abandoned cart item

 // TODO: Get all abandoned carts

 // TODO: Get abandoned carts by store

 // TODO: Resolve abandoned carts