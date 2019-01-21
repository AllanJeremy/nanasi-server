const express = require('express');
const router = express.Router();

const CheckAuth = require('../middleware/checkAuth');
const Payment = require('../lib/payment');

// Checkout
router.post('/checkout', (req, res, next) => {

    Payment.checkout('+254725777084', 10, '5c351cffb6a52b2d980d336c', 'KES', {
        storeId: '5c351cffb6a52b2d980d336c',
        phone: '+254725777084',
        amount: "10",
        paymentType: 'checkout'
    });
});

module.exports = router;