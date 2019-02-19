const express = require("express");
const router = express.Router();
const CheckAuth = require("../middleware/checkAuth");

const CheckoutHandler = require("../handlers/checkoutHandler");

router.get("/checkout", (req, res, next) => {

    // CheckoutHandler.handleCheckout();
});

module.exports = router;