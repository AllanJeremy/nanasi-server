const express = require('express');
const router = express.Router();

const notification = require('../modules/notifications/notifications');

/* NOTIFICATION ENDPOINTS */
// Create notification
//* Globally accessible
router.post('/', (req, res, next) => { //TODO: Add db code
    res.status(201);
    res.json({
        message: "Creating notification"
    });
});

// View user notifications for the currently logged in user
//* Logged in user accessible
router.get('/', (req, res, next) => { //TODO: Add db code
    res.status(200);
    res.json({
        message: `Viewing multiple notifications`
    });
});

// Mark all current user notifications as read
//* Logged in user accessible
router.patch('/mark-all-read', (req, res, next) => { //TODO: Add db code
    res.status(200);

    res.json({
        message: `Marking notification with id of ${notificationId} as unread`
    });
});

// Mark notification that has the if of `notificationId` as read
//* Logged in user accessible
router.patch('/mark-read/:notificationId', (req, res, next) => { //TODO: Add db code
    res.status(200);

    const notificationId = req.params.notificationId;
    res.json({
        id: notificationId,
        message: `Marking notification with id of ${notificationId} as read`
    });
});

// Mark notification as unread
//* Logged in user accessible
router.patch('/mark-unread/:notificationId', (req, res, next) => { //TODO: Add db code
    res.status(200);

    const notificationId = req.params.notificationId;
    res.json({
        id: notificationId,
        message: `Marking notification with id of ${notificationId} as unread`
    });
});

// Exports
module.exports = router;