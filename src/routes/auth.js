const express = require('express');
const router = express.Router();

const api = require('../lib/api');
const otp = require('../modules/auth/otp');
const auth = require('../modules/auth/auth');

/* AUTH ENDPOINTS */
// Send OTP (one time password)
router.post('/otp', (req, res, next) => {
    res.status(200);

    const otpData = {
        type: req.body.type,
        phone: req.body.phone
    };

    let response = otp.sendOtp(null, 'registration', res);
    res.json(response);
});

// Verify OTP (one time password)
router.post('/verifyOtp/:userId', (req, res, next) => {
    const userId = req.params.userId;
    otp.verifyOtp(userId, req.body.otp, req.body.type, (otpVerifyResponse) => {
        res.status(200).json(otpVerifyResponse);
    });

});

// Login
//* Non-Logged in user accessible
router.post('/login', (req, res, next) => { // TODO: Add auth & db code
    // Expected data
    const loginData = {
        phone: req.body.phone,
        otp: req.body.otp
    };
    res.status(200).json({
        loginData: loginData,
        message: `Logging in`
    });
});

// Logout
//* Logged in user accessible
router.post('/logout', (req, res, next) => { // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Logging out`
    });
});

// Register/signup
//* Non-Logged in user accessible
router.post('/register', (req, res, next) => { // TODO: Add auth & db code
    const userData = req.body.data;

    // If userData is not provided ~ show error message
    if (!userData) {
        return res.status(500).json(api.getError('User data not provided, failed to create user'));
    }

    return auth.register(res, userData);
});

// Get currently logged in user object ~ Returns empty object if none is found
//* Globally accessible
router.post('/user', (req, res, next) => { // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Getting currently logged in user`
    });
});

// Exports
module.exports = router;