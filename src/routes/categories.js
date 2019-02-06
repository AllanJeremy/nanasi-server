const express = require('express');
const router = express.Router();

const category = require('../modules/products/categories');

// Get product types
router.get('/productTypes', (req, res, next) => {
    category.getProductTypes(req.body.filter, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get single product type
router.get('/productTypes/:productTypeId', (req, res, next) => {
    category.getSingleProductType(req.params.productTypeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get all categories
router.get('/', (req, res, next) => {
    category.getCategories(req.body.filter, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get product type categories
router.get('/categoryByProductType/:productTypeId', (req, res, next) => {
    category.getProductTypeCategories(req.params.productTypeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get single category
router.get('/:categoryId', (req, res, next) => {
    category.getSingleCategory(req.params.categoryId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});




module.exports = router;