// Models
const Product = require('../../models/products/product');

// Lang files
const FeedbackMessages = require('../../lang/feedbackMessages');

// Libraries
const Api = require('../../lib/api');

/* 
    PRODUCT HELPERS
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
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(productsFound, 'Products') : FeedbackMessages.itemNotFound('Products');

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
    PRODUCT EXPORTS
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

// Get all products
module.exports.getProducts = (filter, callback) => {
    return _getProductsByFilter(filter, callback);
};

// Get products by storeId
module.exports.getStoreProducts = (storeId, callback) => {
    return _getProductsByFilter({
        storeId: storeId
    }, callback);
};

// Get product by productId
module.exports.getProductById = (productId, callback) => {
    return _getSingleProductByFilter({
        _id: productId
    }, callback);
};


// Update product
module.exports.updateProduct = (productId, updateData, callback) => {
    return Product.findByIdAndUpdate(productId, updateData).then((productFound) => {
        // Check if product was found
        if (productFound) {
            // No errors ~ Updated the product
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`product (${productFound.name})`), {
                    id: productId,
                    productName: productFound.name
                })
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Product`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update product`), err)
        );
    });
};

// Delete product
module.exports.deleteProduct = (productId, callback) => {
    return Product.findByIdAndDelete(productId).then((productDeleted) => {
        if (productDeleted) {
            // No errors ~ Deleted the product
            return callback(
                Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully('product'), {
                    id: productId,
                    productName: productDeleted.name
                })
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Product`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`delete product`), err)
        );
    });
};

/* 
    PRODUCT VARIANT HELPERS
*/

/* 
    PRODUCT VARIANT EXPORTS
*/
// Create product variant

// Get product variants

// Get single product variant

// Update product variant

// Delete product variants