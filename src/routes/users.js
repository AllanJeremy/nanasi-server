const express = require('express');
const router = express.Router();

const user = require('../modules/users/users');

/* USER ENDPOINTS */

// Get multiple users 
//* Admin accessible
router.get('/', (req, res, next) => { //TODO: Add db code
    user.getUsers((response) => {
        if (response.ok) {
            return res.status(200).json(response);
        } else {
            return res.status(404).json(response);
        }

        return renderToString;
    });
});

// Get single user
//* Globally accessible
router.get('/:userId', (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Viewing user with the id of ${userId}`
    });
});

// Activate user
//* Admin accessible
router.patch('/activate/:userId', (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Activating user with the id of ${userId}`
    });
});

// Deactivate currently logged in user ~ equivalent of 'delete'
//* Logged in user accessible
router.patch('/deactivate', (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Activating user with the id of ${userId}`
    });
});

// Deactivate user with the id of `:userId`
//* Admin accessible
router.patch('/deactivate/:userId', (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Activating user with the id of ${userId}`
    });
});

// Update user
//* Logged in user accessible
router.patch('/:userId', (req, res, next) => { //TODO: Add db code
    res.status(200);

    const userId = req.param.userId;
    res.json({
        id: userId,
        message: `Viewing user with the id of ${userId}`
    });
});

// Exports
module.exports = router;