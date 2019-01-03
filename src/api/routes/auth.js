const express = require('express');
const router = express.Router();

/* AUTH ENDPOINTS */
// Login
router.post('/login',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Logging in`
    });
});

// Logout
router.post('/logout',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Logging out`
    });
});

// Register/signup
router.post('/login',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Registering new user`
    });
});

// Get currently logged in user object
router.post('/user',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
    res.json({
        message: `Getting currently logged in user`
    });
});

// Exports
module.exports = router;