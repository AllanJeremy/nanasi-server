const Category = require('../../models/products/category');
const ProductType = require('../../models/products/productType');

const Api = require('../../lib/api');
const FeedbackMessages = require('../../lang/feedbackMessages');

/* 
    HELPERS
*/

// Get multiple product types by filter
function _getProductTypesByFilter(filter, callback) {
    filter = filter || {};
    return ProductType.find(filter)
        .populate('image')
        .then((productTypesFound) => {
            const productTypeCount = productTypesFound.length;
            const isOk = (productTypeCount > 0);
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(productTypesFound, 'Product types') : FeedbackMessages.itemNotFound('Product types');

            return callback(
                Api.getResponse(isOk, message, {
                    count: productTypeCount,
                    productTypes: productTypesFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get product types'), err)
            );
        });
}

// Get single product type by filters
function _getSingleProductTypeByFilter(filter, callback) {
    return ProductType.findOne(filter)
        .populate('image')
        .then((productTypeFound) => {
            const isOk = productTypeFound ? true : false;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFound('Product type') : FeedbackMessages.itemNotFound('Product type');

            return callback(
                Api.getResponse(isOk, message, {
                    productType: productTypeFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get product type'), err)
            );
        });
}

// Get multiple categories by filter
function _getCategoriesByFilter(filter, callback) {
    filter = filter || {};
    return Category.find(filter)
        .populate('productType', 'name')
        .populate('images')
        .then((categoriesFound) => {
            const categoryCount = categoriesFound.length;
            const isOk = (categoryCount > 0);
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(categoriesFound, 'Categories') : FeedbackMessages.itemNotFound('Categories');

            return callback(
                Api.getResponse(isOk, message, {
                    count: categoryCount,
                    categories: categoriesFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get categories'), err)
            );
        });
}

// Get single category by filter
function _getSingleCategoryByFilter(filter, callback) {
    return Category.findOne(filter)
        .populate('productType', 'name')
        .populate('images')
        .then((categoryFound) => {
            const isOk = categoryFound ? true : false;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFound('Category') : FeedbackMessages.itemNotFound('Category');

            return callback(
                Api.getResponse(isOk, message, {
                    category: categoryFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get category'), err)
            );
        });
}

/* 
    PRODUCT TYPE EXPORTS
*/
// Get product types
module.exports.getProductTypes = (filter, callback) => {
    return _getProductTypesByFilter(filter, callback);
};

// Get single product type
module.exports.getSingleProductType = (productTypeId, callback) => {
    return _getSingleProductTypeByFilter({
        _id: productTypeId
    }, callback);
};

/* 
    CATEGORY EXPORTS
*/
// Get all categories
module.exports.getCategories = (filter, callback) => {
    return _getCategoriesByFilter(filter, callback);
};

// Get single category
module.exports.getSingleCategory = (categoryId, callback) => {
    return _getSingleCategoryByFilter({
        _id: categoryId
    }, callback);
};

// Get product type categories
module.exports.getProductTypeCategories = (productTypeId, callback) => {
    return _getCategoriesByFilter({
        "productType.id": productTypeId
    }, callback);
};