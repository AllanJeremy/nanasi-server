//* Sets the various directories that will be used for uploads
const UploadConfig = require('../config/uploads');

const Api = require('../lib/api');
const FeedbackMessages = require('../lang/feedbackMessages');

const user = require('../modules/users/users');
const products = require('../modules/products/products');
const categories = require('../modules/products/categories');

/* 
    SETUP IMAGE DATA FUNCTIONS
    Sets image upload data as part of the request
*/
module.exports.setupUserImage = (req, res, next) => {
    req.uploadData = req.uploadData || {};
    req.uploadData.directory = UploadConfig.directory.USERS;
    next();
};

module.exports.setupProductImage = (req, res, next) => {
    req.uploadData = req.uploadData || {};
    req.uploadData.directory = UploadConfig.directory.PRODUCTS;
    next();
};

module.exports.setupCategoryImage = (req, res, next) => {
    req.uploadData = req.uploadData || {};
    req.uploadData.directory = UploadConfig.directory.CATEGORIES;
    next();
};

module.exports.setupProductTypeImage = (req, res, next) => {
    req.uploadData = req.uploadData || {};
    req.uploadData.directory = UploadConfig.directory.PRODUCT_TYPES;
    next();
};

/* 
    SAVE IMAGE INFORMATION TO DATABASE FUNCTIONS
    Saves the id of the image to the database
*/
module.exports.saveUserImageToDb = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const userId = req.params.userId || req.body.userId;

};

module.exports.saveProductImageToDb = (req, res, next) => {
    const imageId = req.uploadData.uploadId;
    const productId = req.params.productId || req.body.productId;

    products.addProductImage(productId, imageId, (response) => {
        return res.status(response.statusCode).json(response);
    });
};

module.exports.saveCategoryImageToDb = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const categoryId = req.params.categoryId || req.body.categoryId;
};

module.exports.saveProductTypeToDb = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const productTypeId = req.params.productTypeId || req.body.productTypeId;
};

/* 
    UPDATE IMAGE INFORMATION IN DATABASE
    Deletes the old image from the database & then replaces it with the new one.
*/
module.exports.updateUserImage = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const userId = req.params.userId || req.body.userId;
};

module.exports.updateProductImage = (req, res, next) => {
    const imageId = req.uploadData.uploadId;
    const productId = req.params.productId || req.body.productId;

    products.updateProductImage(productId, imageId, (response) => {
        return res.status(response.statusCode).json(response);
    });
};

module.exports.updateCategoryImage = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const categoryId = req.params.categoryId || req.body.categoryId;
};

module.exports.updateProductTypeImage = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const productTypeId = req.params.productTypeId || req.body.productTypeId;
};


/* 
    DELETE IMAGE INFORMATION IN DATABASE
    Deletes the image from database and unsets the reference to the image in the respective collection.
*/
module.exports.deleteUserImage = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const userId = req.params.userId || req.body.userId;
};

module.exports.deleteProductImage = (req, res, next) => {
    const imageId = req.uploadData.uploadId;
    const productId = req.params.productId || req.body.productId;

    products.deleteProductImage(productId, imageId, (response) => {
        return res.status(response.statusCode).json(response);
    });
};

module.exports.deleteCategoryImage = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const categoryId = req.params.categoryId || req.body.categoryId;
};

module.exports.deleteProductTypeImage = (req, res, next) => { // TODO: Implement this
    const imageId = req.uploadData.uploadId;
    const productTypeId = req.params.productTypeId || req.body.productTypeId;
};