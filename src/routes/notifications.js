const express = require("express");
const router = express.Router();

const notification = require("../modules/notifications/notifications");
const CheckAuth = require("../middleware/checkAuth");
const Ownership = require("../middleware/entityOwnership");

/* NOTIFICATION ENDPOINTS */
// Create notification
//* Logged in user accessible
router.post("/", CheckAuth.userLoggedIn, (req, res, next) => {
    req.body.data.user = req.userData.id;
    notification.createNotification(req.body.data, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// View user notifications for the currently logged in user
//* Logged in user accessible
router.get("/", CheckAuth.userLoggedIn, (req, res, next) => {
    notification.getUserNotifications(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Mark all current user notifications as read
//* Logged in user accessible
router.patch("/mark-all-read", CheckAuth.userLoggedIn, (req, res, next) => {
    notification.markUserNotificationsAsRead(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Mark notification that has the if of `notificationId` as read
//* Logged in user accessible
router.patch("/mark-read/:notificationId", CheckAuth.userLoggedIn, Ownership.notificationBelongsToUser, (req, res, next) => {
    notification.markNotificationAsRead(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Mark notification as unread
//* Logged in user accessible
router.patch("/mark-unread/:notificationId", CheckAuth.userLoggedIn, Ownership.notificationBelongsToUser, (req, res, next) => {
    notification.markNotificationAsUnread(req.userData.id, (response) => {
        return res.status(response.statusCode).json(response);
    });
});

// Exports
module.exports = router;