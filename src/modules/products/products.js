// Models
const Product = require('../../models/products/product');
const ProductVariant = require('../../models/products/variant');

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
    PRODUCT EXPORTS
*/
// Create product
module.exports.createProduct = (productData, callback) => {
    const newProduct = new Product(productData);

    return newProduct.save().then(createdProduct => {
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('Product'), createdProduct, 201)
        );
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`create product`), err)
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
// Get multiple productVariants by filter
function _getProductVariantsByFilter(filter, callback) {
    filter = filter || {};
    return ProductVariant.find(filter, (err, productVariantsFound) => {
        if (err) {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get product variants'), err)
            );
        }

        const productVariantCount = productVariantsFound.length;
        const isOk = (productVariantCount > 0);
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFoundWithCount(productVariantsFound, 'Product variants') : FeedbackMessages.itemNotFound('Product variants');

        return callback(
            Api.getResponse(isOk, message, {
                count: productVariantCount,
                productVariants: productVariantsFound
            }, statusCode)
        );
    });
}

// Get productVariant by filter
function _getSingleProductVariantByFilter(filter, callback) {
    return ProductVariant.findOne(filter, (err, productVariantFound) => {
        if (err) {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get product variant'), err)
            );
        }

        const isOk = productVariantFound ? true : false;
        const statusCode = isOk ? 200 : 404;
        const message = isOk ? FeedbackMessages.itemsFound('Product variant') : FeedbackMessages.itemNotFound('Product variant');

        return callback(
            Api.getResponse(isOk, message, {
                productVariant: productVariantFound
            }, statusCode)
        );
    });
}

/* 
    PRODUCT VARIANT EXPORTS
*/
// Create product variant
module.exports.createProductVariant = (productVariantData, callback) => {
    const newProductVariant = new Product(productVariantData);

    return newProductVariant.save().then(createdProductVariant => {
        // Save the variant to the product
        Product.findByIdAndUpdate(productVariantData.productId, {
            $push: {
                variants: createdProductVariant
            }
        }, (err, productFound) => {
            // If there was an error
            if (err) {
                return callback(
                    Api.getError(FeedbackMessages.operationFailed(`retrieve product to add variant to`), err, 500)
                );
            }

            // If the product was found
            if (productFound) {
                return callback(
                    Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully('Product variant'), createdProductVariant, 201)
                );
            } else { // Product not found
                return callback(
                    Api.getResponse(false, FeedbackMessages.itemNotFound('Product'), null, 404)
                );
            }
        });
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`create product variant`), err)
        );
    });
};

// Get product variants
module.exports.getProductVariants = (filter, callback) => {
    return _getProductVariantsByFilter(filter, callback);
};

// Get single product variant
module.exports.getProductVariantById = (variantId, callback) => {
    return _getSingleProductVariantByFilter({
        _id: variantId
    }, callback);
};

// Update productVariant variant
module.exports.updateProductVariant = (productVariantId, updateData, callback) => {
    return ProductVariant.findByIdAndUpdate(productVariantId, updateData).then((productVariantFound) => {
        // Check if productVariant was found
        if (productVariantFound) {
            // No errors ~ Updated the productVariant
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`product variant (${productVariantFound.name})`), {
                    id: productVariantId,
                    productVariantName: productVariantFound.name
                })
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Product variant`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update product variant`), err)
        );
    });
};

// Delete productVariant variants
module.exports.deleteProductVariant = (productVariantId, callback) => {
    return ProductVariant.findByIdAndDelete(productVariantId).then((productVariantDeleted) => {
        if (productVariantDeleted) {
            // No errors ~ Deleted the productVariant
            return callback(
                Api.getResponse(true, FeedbackMessages.itemDeletedSuccessfully('productVariant'), {
                    id: productVariantId,
                    productVariantName: productVariantDeleted.name
                })
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Product variant`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`delete product variant`), err)
        );
    });
};