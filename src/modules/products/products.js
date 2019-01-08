// Models
const Product = require('../../models/product');

// Lang files
const FeedbackMessages = require('../../lang/feedbackMessages');

// Libraries
const Api = require('../../lib/api');

/* 
    HELPERS
*/
// Get multiple products by filter
function _getProductsByFilter(filter, callback) {
    filter = filter || {};
    return Product.find(filter, (err, productsFound) => {
        if (err) {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get products'), err)
            );
        }

        const productCount = productsFound.length;
        const isOk = (productCount > 0);
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(productsFound, 'Products') : FeedbackMessages.itemNotFound('Product');

        return callback(
            Api.getResponse(isOk, message, {
                count: productCount,
                products: productsFound
            }, statusCode)
        );
    });
}

// Get product by filter
function _getSingleProductByFilter(filter, callback) {
    return Product.findOne(filter, (err, productFound) => {
        if (err) {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get product'), err)
            );
        }

        const isOk = productFound ? true : false;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFound('Product') : FeedbackMessages.itemNotFound('Product');

        return callback(
            Api.getResponse(isOk, message, {
                product: productFound
            }, statusCode)
        );
    });
}

/* 
    EXPORTS
*/
// Create product
module.exports.createProduct = (productData, callback) => {
    const newProduct = new Product(productData);

    return newProduct.save().then(createdProduct => {
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('Product'), createdProduct)
        );
    }).catch(err => {
        const message = FeedbackMessages.operationFailed(`create product`);
        return callback(
            Api.getError(message, err)
        );
    });
};