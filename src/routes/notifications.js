const express = require("express");
const router = express.Router();

const notification = require("../modules/notifications/notifications");

/* NOTIFICATION ENDPOINTS */
// Create notification
//* Globally accessible
router.post("/", (req, res, next) => { //TODO: Add db code

    //TODO: Set the user id to the current user id, passed via middleware
    // req.body.data.user = req.userData._id;
    notification.createNotification(req.body.data, response => {
        return res.status(response.statusCode).json(response);
    });
});

// View user notifications for the currently logged in user
//* Logged in user accessible
router.get("/", (req, res, next) => { //TODO: Add db code
    //TODO: Set the user id to the current user id, passed via middleware
    notification.getUserNotifications(req.userData._id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Mark all current user notifications as read
//* Logged in user accessible
router.patch("/mark-all-read", (req, res, next) => { //TODO: Add db code
    //TODO: Set the user id to the current user id, passed via middleware
    notification.markUserNotificationsAsRead(req.userData._id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Mark notification that has the if of `notificationId` as read
//* Logged in user accessible
router.patch("/mark-read/:notificationId", (req, res, next) => { //TODO: Add db code
    //TODO: Set the user id to the current user id, passed via middleware
    notification.markNotificationAsRead(req.userData._id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Mark notification as unread
//* Logged in user accessible
router.patch("/mark-unread/:notificationId", (req, res, next) => { //TODO: Add db code
    //TODO: Set the user id to the current user id, passed via middleware
    notification.markNotificationAsUnread(req.userData._id, response => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;