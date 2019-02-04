const express = require('express');
const router = express.Router();

const user = require('../modules/users/users');
const CheckAuth = require('../middleware/checkAuth');

const Api = require('../lib/api');


/* ADDRESS ENDPOINTS */
// Add address
//* Logged in user accessible
router.post('/address', CheckAuth.userLoggedIn, (req, res, next) => {
    user.addAddress(req.userData.id, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Get single address
//* Logged in user accessible
router.get('/address/:addressId', CheckAuth.userLoggedIn, (req, res, next) => {
    user.getSingleAddress(req.params.addressId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update address
//* Logged in user accessible
router.patch('/address/:addressId', CheckAuth.userLoggedIn, (req, res, next) => {
    user.updateAddress(req.params.addressId, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Delete address
//* Logged in user accessible
router.delete('/address/:addressId', CheckAuth.userLoggedIn, (req, res, next) => {
    user.deleteAddress(req.userData.id, req.params.addressId, response => {
        return res.status(response.statusCode).json(response);
    });
});


/* USER ENDPOINTS */
// Get current user given a certain token
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

// Ativate currently logged in user 
//* Logged in user accessible
router.patch('/activate', CheckAuth.userLoggedIn, (req, res, next) => { //TODO: Add db code
    user.enableUserAccount(req.userData.id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Deactivate currently logged in user ~ equivalent of 'delete'
//* Logged in user accessible
router.patch('/deactivate', CheckAuth.userLoggedIn, (req, res, next) => { //TODO: Add db code
    user.disableUserAccount(req.userData.id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Activate user
//* Admin accessible
router.patch('/activate/:userId', CheckAuth.adminLoggedIn, (req, res, next) => { //TODO: Add db code
    user.enableUserAccount(req.params.userId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Deactivate user with the id of `:userId`
//* Admin accessible
router.patch('/deactivate/:userId', CheckAuth.adminLoggedIn, (req, res, next) => { //TODO: Add db code
    user.disableUserAccount(req.params.userId, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Update currently logged in user account
//* Logged in user accessible
router.patch('/', CheckAuth.userLoggedIn, (req, res, next) => { //TODO: Add db code
    user.updateUser(req.userData.id, req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;