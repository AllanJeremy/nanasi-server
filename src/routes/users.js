const express = require('express');
const router = express.Router();

const user = require('../modules/users/users');
const CheckAuth = require('../middleware/checkAuth');

const Api = require('../lib/api');

/* USER ENDPOINTS */
// Get a user given a certain token
router.get('/token', CheckAuth.userLoggedIn, (req, res, next) => {
    return res.status(200).json(Api.getResponse(true, `Successfully retrieved user data`, req.userData));
});


// Get multiple users 
//* Admin accessible
router.get('/', CheckAuth.adminLoggedIn, (req, res, next) => { //TODO: Add db code
    user.getUsers(req.body.filters, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Get single user
//* Globally accessible
router.get('/:userId', (req, res, next) => { //TODO: Add db code
    user.getUserById(req.params.userId, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Activate user
//* Admin accessible
router.patch('/activate/:userId', CheckAuth.adminLoggedIn, (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Activating user with the id of ${userId}`
    });
});

// Deactivate currently logged in user ~ equivalent of 'delete'
//* Logged in user accessible
router.patch('/deactivate', CheckAuth.userLoggedIn, (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Activating user with the id of ${userId}`
    });
});

// Deactivate user with the id of `:userId`
//* Admin accessible
router.patch('/deactivate/:userId', CheckAuth.adminLoggedIn, (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Activating user with the id of ${userId}`
    });
});

// Update user
//* Logged in user accessible
router.patch('/:userId', CheckAuth.userLoggedIn, (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Viewing user with the id of ${userId}`
    });
});

// Exports
module.exports = router;