const express = require("express");
const router = express.Router();

const order = require("../modules/orders/orders");
const CheckAuth = require("../middleware/checkAuth");
const Ownership = require("../middleware/entityOwnership");

/* ORDER ENDPOINTS */
// Create order
//* Buyer accessible
router.post("/", CheckAuth.buyerLoggedIn, (req, res, next) => { //TODO: Add db code
    order.createOrder(req.userData.id, req.body.deliveryAddress, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// View logged in buyer orders
//* Buyer accessible
router.get("/", CheckAuth.buyerLoggedIn, Ownership.orderBelongsToBuyer, (req, res, next) => { //TODO: Add db code
    order.getBuyerOrders(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

//* Merchant accessible
// Get store summary
router.get("/store/summary/:storeId",CheckAuth.merchantLoggedIn,Ownership.orderBelongsToMerchant,(req,res)=>{
    order.getStoreSummary(req.params.storeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get store sales
router.get("/store/sales/:storeId", CheckAuth.merchantLoggedIn, Ownership.orderBelongsToMerchant, (req, res, next) => {
    order.getStoreSales(req.params.storeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get store orders
//* Merchant accessible
router.get("/store/:storeId", CheckAuth.merchantLoggedIn, Ownership.orderBelongsToMerchant, (req, res, next) => {
    order.getStoreOrders(req.params.storeId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get product orders
//* Merchant accessible
router.get("/product/:productId", CheckAuth.merchantLoggedIn, Ownership.orderBelongsToMerchant, (req, res, next) => {
    order.getProductOrders(req.params.productId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// View single order
//* Merchant accessible
//* Buyer accessible
router.get("/:orderId", CheckAuth.userLoggedIn, (req, res, next) => { //TODO: Add middleware to check for buyer or merchant logged in in one function call
    order.getOrderById(req.params.orderId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Decline order
//* Merchant accessible
router.patch("/decline/:orderId", CheckAuth.merchantLoggedIn, Ownership.orderBelongsToMerchant, (req, res, next) => { //TODO: Add db code
    order.declineOrder(req.params.orderId, req.body.reason, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Fulfil/Complete order
//* Merchant accessible
router.patch("/complete/:orderId", CheckAuth.merchantLoggedIn, Ownership.orderBelongsToMerchant, (req, res, next) => { //TODO: Add db code
    order.fulfilOrder(req.params.orderId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Update order
//* Buyer accessible
router.patch("/:orderId", CheckAuth.buyerLoggedIn, Ownership.orderBelongsToBuyer, (req, res, next) => { //TODO: Add db code
    order.updateOrder(req.params.orderId, req.body.data, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Cancel order
//* Buyer accessible
router.delete("/:orderId", CheckAuth.buyerLoggedIn, Ownership.orderBelongsToBuyer, (req, res, next) => { //TODO: Add db code
    order.cancelOrder(orderId, (response) => {
        res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;