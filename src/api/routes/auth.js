const express = require('express');
const router = express.Router();

/* AUTH ENDPOINTS */
// Send OTP (one time password)
router.post('/otp',(req,res,next)=>{
    res.status(200);

    const otpData = {
        type:req.body.type,
        phone:req.body.phone 
    };

    res.json({
        otpData: otpData,
        message: "Sending OTP"
    });
});

// Login
//* Non-Logged in user accessible
router.post('/login',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);

    // Expected data
    const loginData = {
        phone: req.body.phone,
        otp: req.body.otp
    };
    res.json({
        loginData: loginData,
        message: `Logging in`
    });
});

// Logout
//* Logged in user accessible
router.post('/logout',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Logging out`
    });
});

// Register/signup
//* Non-Logged in user accessible
router.post('/register',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(201);
    res.json({
        message: `Registering new user`
    });
});

// Get currently logged in user object ~ Returns empty object if none is found
//* Globally accessible
router.post('/user',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Getting currently logged in user`
    });
});

// Exports
module.exports = router;