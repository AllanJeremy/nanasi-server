const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/checkAuth");
const payment = require("../modules/payments/payments");

// Checkout
router.post("/checkout", CheckAuth.buyerLoggedIn, (req, res, next) => {

    payment.buyerCheckout(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

module.exports = router;