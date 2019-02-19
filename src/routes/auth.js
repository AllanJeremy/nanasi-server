const express = require("express");
const router = express.Router();

const api = require("../lib/api");
const otp = require("../modules/auth/otp");
const Auth = require("../modules/auth/auth");

/* AUTH ENDPOINTS */
// Send OTP (one time password)
router.post("/otp", (req, res, next) => {
    otp.sendOtp(req.body.phone, req.body.type, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Verify OTP (one time password)
router.post("/verifyOtp", (req, res, next) => {
    otp.verifyOtp(req.body.phone, req.body.otp, req.body.type, (response) => {
        res.status(response.statusCode).json(response);
    });

});

// Login
//* Non-Logged in user accessible
router.post("/login", (req, res, next) => { // TODO: Add auth & db code
    // Expected data
    Auth.login(req.body.phone, req.body.otp, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Logout
//* Logged in user accessible
router.post("/logout", (req, res, next) => { // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Logging out`
    });
});

// Register/signup
//* Non-Logged in user accessible
router.post("/register", (req, res, next) => { // TODO: Add auth & db code
    const userData = req.body.data;

    // If userData is not provided ~ show error message
    if (!userData) {
        return res.status(500).json(api.getError("User data not provided, failed to create user"));
    }

    Auth.register(userData, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Confirm registration
router.post("/confirmRegistration", (req, res, next) => {
    Auth.confirmRegistration(req.body.phone, req.body.otp, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get currently logged in user object ~ Returns empty object if none is found
//* Globally accessible
router.post("/user", (req, res, next) => { // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Getting currently logged in user`
    });
});

// Exports
module.exports = router;