const express = require('express');
const router = express.Router();

const product = require('../modules/products/products');

/* PRODUCT VARIANTS 
Added here to avoid request param overlap with product/:attribute
*/
// Create product variant
//* Merchant accessible
router.post('/variants/:productId', (req, res, next) => { //TODO: Add db code
    req.body.data.productId = req.params.productId;
    product.createProductVariant(req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View multiple product variants belonging to a certain product
//* Globally accessible
router.get('/variants/:productId', (req, res, next) => { //TODO: Add db code
    const filter = {
        productId: req.params.productId
    };

    product.getProductVariants(filter, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single product variant
//* Globally accessible
router.get('/single-variant/:variantId', (req, res, next) => { //TODO: Add db code
    product.getProductVariantById(req.params.variantId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update product variant
//* Merchant accessible
router.patch('/variants/:variantId', (req, res, next) => { //TODO: Add db code
    product.updateProductVariant(req.params.variantId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete product variant
//* Merchant accessible
router.delete('/variants/:variantId', (req, res, next) => { //TODO: Add db code
    product.deleteProductVariant(req.params.variantId, response => {
        return res.status(response.statusCode).json(response);
    });
});

/* PRODUCTS */
// Create products
//* Merchant accessible
router.post('/', (req, res, next) => { //TODO: Add db code
    product.createProduct(req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View multiple products
//* Globally accessible
router.get('/', (req, res, next) => { //TODO: Add db code
    product.getProducts(req.body.filters, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View merchant products
//* Globally accessible
router.get('/store/:storeId', (req, res, next) => { //TODO: Add db code
    product.getStoreProducts(req.params.storeId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single product
//* Globally accessible
router.get('/:productId', (req, res, next) => { //TODO: Add db code
    product.getProductById(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update product
//* Merchant accessible
router.patch('/:productId', (req, res, next) => { //TODO: Add db code
    product.updateProduct(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete products
//* Merchant accessible
router.delete('/:productId', (req, res, next) => { //TODO: Add db code
    product.deleteProduct(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;