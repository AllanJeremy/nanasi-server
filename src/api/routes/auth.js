const express = require('express');
const router = express.Router();

/* AUTH ENDPOINTS */
// Login
//* Non-Logged in user accessible
router.post('/login',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
    res.json({
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
router.post('/login',(req,res,next)=>{ // TODO: Add auth & db code
    res.status(200);
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