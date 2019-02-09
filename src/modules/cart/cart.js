 const Cart = require('../../models/cart');
 const Api = require('../../lib/api');
 const FeedbackMessages = require('../../lang/feedbackMessages');

 // Get multiple cart by filter
 function _getCartsByFilter(filter, callback) {
     filter = filter || {};
     return Cart.find(filter)
         .populate('product', 'name')
         .populate('user', '_id name')
         .then((cartFound) => {
             const cartCount = cartFound.length;
             const isOk = (cartCount > 0);
             const statusCode = isOk ? 200 : 404;
             const message = isOk ? FeedbackMessages.itemsFoundWithCount(cartFound, 'Cart items') : FeedbackMessages.itemNotFound('Carts');

             return callback(
                 Api.getResponse(isOk, message, {
                     count: cartCount,
                     cart: cartFound
                 }, statusCode)
             );
         })
         .catch(err => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed('get cart'), err)
             );
         });
 }

 // Get cartItem by filter
 function _getSingleCartByFilter(filter, callback) {
     return Cart.findOne(filter)
         .populate('product', 'name')
         .populate('user')
         .then((cartItemFound) => {
             const isOk = cartItemFound ? true : false;
             const statusCode = isOk ? 200 : 404;
             const message = isOk ? FeedbackMessages.itemsFound('Cart item') : FeedbackMessages.itemNotFound('Cart');

             return callback(
                 Api.getResponse(isOk, message, {
                     cartItem: cartItemFound
                 }, statusCode)
             );
         })
         .catch(err => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed('get cart item'), err)
             );
         });
 }
 // Add item to cart
 function _addCartItems(userId, itemsToAdd, callback) { // items = [{product: <id>, quantity: <qty>}]
     Cart.findOne({
             user: userId,
             orderIsCompleted: false
         })
         .then(cartFound => {
             let cartItems = cartFound.items;
             // Check if the item being added already exists in the cart
             if (!carItemFound || (cartItems.length < 1)) { // Item does not exist ~ create it
                 const cartItem = new Cart({
                     items: itemsToAdd,
                     user: userId
                 });

                 return cartItem.save().then(createdCartItem => {
                     return callback(
                         Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('Cart item'), createdCartItem, 201)
                     );
                 }).catch(err => {
                     return callback(
                         Api.getError(FeedbackMessages.operationFailed(`create cart item`), err)
                     );
                 });
             }

             // Cart item found
             let itemCartIndex; // index of the item in the cart
             let productId;


             itemsToAdd.map(itemToAdd => {
                 productId = itemToAdd.productId; //* Remember to pass this in as productId and not product
                 itemCartIndex = cartItems.indexOf(productId);

                 // This specific item already exists in the cart found ~ update quantity
                 if (itemCartIndex !== -1) {
                     cartFound.items[itemCartIndex].quantity = itemToAdd.quantity;
                 } else { // Item does not exist in cart, add it
                     // Product id
                     cartFound.items.push(itemToAdd);
                 }
             });

             // Save cart items to database
             cartFound.save()
                 .then(createdCartItem => {
                     return callback(
                         Api.getResponse(true, FeedbackMessages.operationSucceeded('added cart item'), createdCartItem, 201)
                     );
                 }).catch(err => {
                     return callback(
                         Api.getError(FeedbackMessages.operationFailed(`add cart item`), err)
                     );
                 });
         })
         .catch(err => {
             return callback(
                 Api.getError(err.message, err)
             );
         });
 }

 // Delete single cart item
 function _removeSingleCartItem(cartId, productId, callback) {
     Cart.findById(cartId)
         .then(cartFound => {
             if (!cartFound) {
                 return callback(
                     Api.getResponse(false, FeedbackMessages.itemNotFound(`Cart`), undefined, 404)
                 );
             }

             // Cart item found ~ Find item to remove
             cartFound.items = cartFound.items.filter(itemFound => {
                 return (itemFound.product != productId);
             });

             // Update cart ~ remove cart item
             cartFound.items.save()
                 .then(updatedCart => {
                     return callback(
                         Api.getResponse(true, FeedbackMessages.operationSucceeded(`removed cart item`), updatedCart)
                     );
                 })
                 .catch(err => {
                     return callback(
                         Api.getError(err.message, err)
                     );
                 });

         })
         .catch(err => {
             return callback(
                 Api.getError(err.message, err)
             );
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
     return _getCartsByFilter({
         user: userId,
         orderIsCompleted: false
     }, callback);
 };

 // Get single cart item
 module.exports.getCartItem = (cartItemId, callback) => {
     return _getSingleCartByFilter({
         _id: cartItemId
     }, callback);
 };

 // Update cart item ~ Often used to update the item quantity in the cart
 module.exports.updateCart = (cartItemId, updateData, callback) => {
     return Cart.findByIdAndUpdate(cartItemId, updateData).then((cartItemFound) => {
         // Check if cartItem was found
         if (cartItemFound) {
             // No errors ~ Updated the cartItem
             return callback(
                 Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`cart item`), {
                     id: cartItemId
                 })
             );
         } else {
             return callback(
                 Api.getError(FeedbackMessages.itemNotFound(`Cart item`), null, 404)
             );
         }
     }).catch(err => {
         return callback(
             Api.getError(FeedbackMessages.operationFailed(`update cart item`), err)
         );
     });
 };

 // Delete single cart item
 module.exports.removeCartItem = (cartId, productId, callback) => {
     return _removeSingleCartItem(cartId, productId, callback);
 };

 // Delete entire cart
 module.exports.deleteCart = (cartId, callback) => {
     return Cart.findByIdAndDelete(cartId).then((cartItemDeleted) => {
         if (cartItemDeleted) {
             // No errors ~ Deleted the cartItem
             return callback(
                 Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully('cart item'), {
                     id: cartId,
                     cartItemName: cartItemDeleted.name
                 })
             );
         } else {
             return callback(
                 Api.getError(FeedbackMessages.itemNotFound(`Cart`), null, 404)
             );
         }
     }).catch(err => {
         return callback(
             Api.getError(FeedbackMessages.operationFailed(`delete cart item`), err)
         );
     });
 };

 module.exports.getCartTotal = (cartId, callback) => { //TODO: Debug
     Cart.findById(cartId)
         .populate('items.product')
         .then(cartItemFound => {
             if (!cartItemFound) {
                 return callback(
                     Api.getError(FeedbackMessages.itemNotFound(`Cart item`), null, 404)
                 );
             }

             // Calculating total cart price
             let total = 0;
             cartItemFound.items.map(product => {
                 let productPrice = product.salePrice || product.regularPrice;

                 total += (product.quantity * productPrice);
             });

             //* Nanasi will still retain their revenue (8% of regular price)

             return callback(
                 Api.getResponse(true, FeedbackMessages.operationSucceeded(`calculated cart total`), {
                     total: total,
                     userId: cartItemFound.user,
                     items: cartItemFound.items
                 })
             );
         })
         .catch(err => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed(`calculate cart total`), err)
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