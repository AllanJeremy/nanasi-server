const express = require('express');
const router = express.Router();

const store = require('../modules/store/stores');

/* STORE ENDPOINTS */
// Create store
//* Merchant accessible
router.post('/', (req, res, next) => { //TODO: Add db code
    store.createStore(req.body.data, response => {
        return res.status(response.statusCode).json(response); //TODO: refactor this
    });
});

// View multiple stores
//* Globally accessible
router.get('/', (req, res, next) => { //TODO: Add db code
    store.getStores(req.body.filters, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get merchant store
//* Globally accessible
router.get('/merchant/:merchantId', (req, res, next) => {
    store.getMerchantStores(req.params.merchantId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single store
//* Globally accessible
router.get('/:storeId', (req, res, next) => { //TODO: Add db code
    store.getStoreById(req.params.storeId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update store
//* Merchant accessible
router.patch('/:storeId', (req, res, next) => { //TODO: Add db code
    store.updateStore(req.params.storeId, response => {
        return res.status(response.statusCode.json(response));
    });
});

// Delete store
//* Merchant accessible
router.delete('/:storeId', (req, res, next) => { //TODO: Add db code
    store.deleteStore(req.params.storeId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;