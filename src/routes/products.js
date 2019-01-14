const express = require('express');
const router = express.Router();

const CheckAuth = require('../middleware/checkAuth');
const product = require('../modules/products/products');

/* PRODUCT VARIANTS 
Added here to avoid request param overlap with product/:attribute
*/
// Create product variant
//* Merchant accessible
router.post('/variants', CheckAuth.merchantLoggedIn, (req, res, next) => { //TODO: Add db code
    //TODO: Check if the product we are trying to add the filter to belongs to the currently logged in merchant
    product.createProductVariant(req.body.data, (response) => {
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
router.patch('/variants/:variantId', CheckAuth.merchantLoggedIn, (req, res, next) => {
    //TODO: Check if the variant belongs to a product owned by currently logged in user before allowing update
    product.updateProductVariant(req.params.variantId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete product variant
//* Merchant accessible
router.delete('/variants/:variantId', CheckAuth.merchantLoggedIn, (req, res, next) => {
    //TODO: Check if the variant belongs to a product owned by currently logged in user before allowing delete
    product.deleteProductVariant(req.params.variantId, response => {
        return res.status(response.statusCode).json(response);
    });
});

/* PRODUCTS */
// Create products
//* Merchant accessible
router.post('/', CheckAuth.merchantLoggedIn, (req, res, next) => {
    //TODO: Check that the product is being added to a store owned by the currently logged in merchant
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
router.patch('/:productId', CheckAuth.merchantLoggedIn, (req, res, next) => { //TODO: Add db code
    //TODO: Check that the product is owned by the currently logged in merchant
    product.updateProduct(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete products
//* Merchant accessible
router.delete('/:productId', CheckAuth.merchantLoggedIn, (req, res, next) => { //TODO: Add db code
    //TODO: Check that the product is owned by the currently logged in merchant
    product.deleteProduct(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;