const express = require('express');
const router = express.Router();

const CheckAuth = require('../middleware/checkAuth');
const Ownership = require('../middleware/entityOwnership');

const product = require('../modules/products/products');

const GCloudUploader = require('../middleware/gCloudUploader');
const UploadManager = require('../middleware/uploadManager');

/* 
    PRODUCT IMAGES
    Handles upload/deletion of images from google cloud platform
*/
router.post('/upload/:productId', /* CheckAuth.merchantLoggedIn, Ownership.productBelongsToMerchant, */ UploadManager.setupProductImage, GCloudUploader.multer.single('image'), GCloudUploader.sendUploadToGCS, UploadManager.saveUploadedImageToDb, UploadManager.saveProductImageToDb);

router.post('/deleteImage', /* CheckAuth.merchantLoggedIn, Ownership.productBelongsToMerchant, */ UploadManager.getImageData, GCloudUploader.deleteFromGCS, UploadManager.deleteProductImage);

/* PRODUCT VARIANTS 
Added here to avoid request param overlap with product/:attribute
*/
// Create product variant
//* Merchant accessible
router.post('/variants', CheckAuth.merchantLoggedIn, Ownership.productBelongsToMerchant, (req, res, next) => {
    product.createProductVariant(req.body.data, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// View multiple product variants belonging to a certain product
//* Globally accessible
router.get('/variants/:productId', (req, res, next) => {
    const filter = {
        productId: req.params.productId
    };

    product.getProductVariants(filter, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single product variant
//* Globally accessible
router.get('/single-variant/:variantId', (req, res, next) => {
    product.getProductVariantById(req.params.variantId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update product variant
//* Merchant accessible
router.patch('/variants/:variantId', CheckAuth.merchantLoggedIn, Ownership.productVariantBelongsToMerchant, (req, res, next) => {
    product.updateProductVariant(req.params.variantId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete product variant
//* Merchant accessible
router.delete('/variants/:variantId', CheckAuth.merchantLoggedIn, Ownership.productVariantBelongsToMerchant, (req, res, next) => {
    product.deleteProductVariant(req.params.variantId, response => {
        return res.status(response.statusCode).json(response);
    });
});

/* PRODUCTS */
// Create products
//* Merchant accessible
router.post('/', CheckAuth.merchantLoggedIn, Ownership.storeBelongsToMerchant, (req, res, next) => {
    product.createProduct(req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View multiple products
//* Globally accessible
router.get('/', (req, res, next) => {
    product.getProducts(req.body.filters, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get products by category
//* Globally accessible
router.get('/category/:categoryId', (req, res, next) => {
    product.getProductsByCategory(req.params.categoryId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View store products
//* Globally accessible
router.get('/store/:storeId', (req, res, next) => {
    product.getStoreProducts(req.params.storeId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single product
//* Globally accessible
router.get('/:productId', (req, res, next) => {
    product.getProductById(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update product
//* Merchant accessible
router.patch('/:productId', CheckAuth.merchantLoggedIn, Ownership.productBelongsToMerchant, (req, res, next) => {
    product.updateProduct(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete products
//* Merchant accessible
router.delete('/:productId', CheckAuth.merchantLoggedIn, Ownership.productBelongsToMerchant, (req, res, next) => {
    console.log(`delete product`);
    product.deleteProduct(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;