 const Cart = require('../../models/cart');

 // Get multiple cart by filter
 function _getCartItemsByFilter(filter, callback) {
     filter = filter || {};
     return Cart.find(filter)
         .populate('product', 'name')
         .populate('user', '_id name')
         .then((cartFound) => {
             const cartCount = cartFound.length;
             const isOk = (cartCount > 0);
             const statusCode = isOk ? 200 : 404;
             const message = isOk ? FeedbackMessages.itemsFoundWithCount(cartFound, 'Carts') : FeedbackMessages.itemNotFound('Carts');

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
 function _getSingleCartItemByFilter(filter, callback) {
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

 /* 
     EXPORTS
 */
 // Add item to cart
 module.exports.addCartItem = (itemData, callback) => {
     const cartItem = new Cart(itemData);

     return cartItem.save().then(createdCartItem => {
         return callback(
             Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('Cart item'), createdCartItem, 201)
         );
     }).catch(err => {
         return callback(
             Api.getError(FeedbackMessages.operationFailed(`create cart item`), err)
         );
     });
 };

 // View cart items for the current user
 module.exports.getUserCart = (userId, callback) => {
     return _getCartItemsByFilter({
         user: userId
     }, callback);
 };

 // Get single cart item
 module.exports.getCartItem = (cartItemId, callback) => {
     return _getSingleCartItemByFilter({
         _id: cartItemId
     }, callback);
 };

 // Update cart item ~ Often used to update the item quantity in the cart
 module.exports.updateCartItem = (cartItemId, updateData, callback) => {
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

 // Delete cart item ~ Remove item from cart
 module.exports.deleteCartItem = (cartItemId, callback) => {
     return Cart.findByIdAndDelete(cartItemId).then((cartItemDeleted) => {
         if (cartItemDeleted) {
             // No errors ~ Deleted the cartItem
             return callback(
                 Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully('cart item'), {
                     id: cartItemId,
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

 module.exports.getCartTotal = (cartId, callback) => {
     Cart.findById(cartId)
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
                     total: total
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