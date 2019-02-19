//* Sets the various directories that will be used for uploads
const UploadConfig = require("../config/uploads");

const Api = require("../lib/api");
const FeedbackMessages = require("../lang/feedbackMessages");

const Image = require("../models/image");

const user = require("../modules/users/users");
const products = require("../modules/products/products");
const category = require("../modules/products/categories");

/* 
    IMAGES
*/
module.exports.getImageData = (req, res, next) => {
    //* Remember to pass in the image id as part of the request body
    Image.findById(req.body.imageId)
        .then(imageFound => {
            // Image not found
            if (!imageFound) {
                console.debug(`Image not found`);
                const statusCode = 404;
                return res.status(statusCode).json(
                    Api.getResponse(false, FeedbackMessages.itemNotFound(`Image`), null, statusCode)
                );
            }

            console.debug(`Image found`);
            // Image found ~ Pass appropriate data
            req.uploadData = req.uploadData || {};
            req.uploadData.imageUrl = imageFound.imageUrl;
            next();
        })
        .catch((err) => {
            return res.status(500).json(Api.getError(err.message, err));
        });
};

//* MUST be called after upload to GCS middleware function & before save to any collection that needs the reference
module.exports.saveUploadedImageToDb = (req, res, next) => {
    const image = new Image({
        imageUrl: req.file.cloudStoragePublicUrl,
        thumbnailUrl: req.file.cloudStoragePublicUrl //TODO: Create thumbnail version of the image
    });

    // Save the image to the database
    image.save()
        .then(uploadedImage => {
            req.uploadData = req.uploadData || {};
            req.uploadData.uploadedImage = uploadedImage;
            next();
        })
        .catch((err) => {
            return res.status(500).json(
                Api.getError(err.message, err)
            );
        });
};

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
    const imageId = req.uploadData.uploadedImage.id;
    const productId = req.params.productId || req.body.productId;

    products.addProductImage(productId, imageId, (response) => {
        response.data = response.data || {};
        response.data = req.uploadData.uploadedImage;
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