const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/checkAuth");
const payment = require("../modules/payments/payments");

// Checkout
router.post("/checkout", (req, res, next) => {

    payment.buyerCheckout(req.body.cartId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

module.exports = router;