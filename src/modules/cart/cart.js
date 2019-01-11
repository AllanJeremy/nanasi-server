 const Cart = require('../../models/cart');

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

 // Get product by filter
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
                     product: cartItemFound
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

 };

 // View cart items for the current user
 module.exports.getUserCart = (userId, callback) => {

 };

 // Get single cart item
 module.exports.getCartItem = (cartItemId, callback) => {

 };

 // Update cart item ~ Often used to update the item quantity in the cart
 module.exports.updateCartItem = (cartItemId, updateData, callback) => {

 };

 // Delete cart item ~ Remove item from cart
 module.exports.deleteCartItem = (itemData, callback) => {

 };