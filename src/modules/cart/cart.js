 const Cart = require('../../models/cart');

 // Get multiple products by filter
 function _getProductsByFilter(filter, callback) {
     filter = filter || {};
     return Product.find(filter)
         .populate('store', '_id name')
         .populate('images')
         .populate('variants')
         .then((productsFound) => {
             const productCount = productsFound.length;
             const isOk = (productCount > 0);
             const statusCode = isOk ? 200 : 404;
             const message = isOk ? FeedbackMessages.itemsFoundWithCount(productsFound, 'Products') : FeedbackMessages.itemNotFound('Products');

             return callback(
                 Api.getResponse(isOk, message, {
                     count: productCount,
                     products: productsFound
                 }, statusCode)
             );
         })
         .catch(err => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed('get products'), err)
             );
         });
 }

 // Get product by filter
 function _getSingleProductByFilter(filter, callback) {
     return Product.findOne(filter)
         .populate('store', '_id name')
         .populate('images')
         .populate('variants')
         .then((productFound) => {
             const isOk = productFound ? true : false;
             const statusCode = isOk ? 200 : 404;
             const message = isOk ? FeedbackMessages.itemsFound('Product') : FeedbackMessages.itemNotFound('Product');

             return callback(
                 Api.getResponse(isOk, message, {
                     product: productFound
                 }, statusCode)
             );
         })
         .catch(err => {
             return callback(
                 Api.getError(FeedbackMessages.operationFailed('get products'), err)
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