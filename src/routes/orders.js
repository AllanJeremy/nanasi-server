const express = require('express');
const router = express.Router();

const order = require('../modules/orders/orders');

/* ORDER ENDPOINTS */
// Create order
//* Buyer accessible
router.post('/', (req, res, next) => { //TODO: Add db code
    order.createOrder(req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View logged in buyer orders
//* Buyer accessible
router.get('/', (req, res, next) => { //TODO: Add db code
    order.getBuyerOrders(req.body.filter, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get store orders
//* Merchant accessible
router.get('/store/:storeId', (req, res, next) => {
    order.getStoreOrders(req.params.storeId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get product orders
//* Merchant accessible
router.get('/product/:productId', (req, res, next) => {
    order.getProductOrders(req.params.productId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View single order
//* Merchant accessible
//* Buyer accessible
router.get('/:orderId', (req, res, next) => { //TODO: Add db code
    order.getOrderById(req.params.orderId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Decline order
//* Merchant accessible
router.patch('/decline/:orderId', (req, res, next) => { //TODO: Add db code
    order.declineOrder(req.params.orderId, req.body.reason, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Fulfil/Complete order
//* Merchant accessible
router.patch('/complete/:orderId', (req, res, next) => { //TODO: Add db code
    order.fulfilOrder(req.params.orderId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update order
//* Buyer accessible
router.patch('/:orderId', (req, res, next) => { //TODO: Add db code
    order.updateOrder(req.params.orderId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Cancel order
//* Buyer accessible
router.delete('/:orderId', (req, res, next) => { //TODO: Add db code
    order.cancelOrder(orderId, response => {
        res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;