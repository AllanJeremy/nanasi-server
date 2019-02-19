const Notification = require("../../models/notification");

const Api = require("../../lib/api");
const FeedbackMessages = require("../../lang/feedbackMessages");

/* 
    HELPERS
*/
//Get notifications by filter
// Get multiple notifications by filter
function _getNotificationsByFilter(filter) {
    filter = filter || {};
    return Notification.find(filter)
        .populate("user", "_id firstName lastName")
        .then((notificationsFound) => {
            const notificationCount = notificationsFound.length;
            const isOk = (notificationCount > 0);
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(notificationsFound, "Notifications") : FeedbackMessages.itemNotFound("Notifications");

            return callback(
                Api.getResponse(isOk, message, {
                    count: notificationCount,
                    notifications: notificationsFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed("get notifications"), err)
            );
        });
}

// Get notification by filter
function _getSingleNotificationByFilter(filter) {
    return Notification.findOne(filter)
        .populate("user", "_id name firstName lastName")
        .then((NotificationFound) => {
            const isOk = NotificationFound ? true : false;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFound("Notification") : FeedbackMessages.itemNotFound("Notification");

            return callback(
                Api.getResponse(isOk, message, {
                    notification: NotificationFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed("get notifications"), err)
            );
        });
}

// Allows for marking all user notifications as read
function _setUserNotificationsReadStatus(userId, isRead) {
    Notification.findAndUpdate({
        user: userId
    }, {
        isRead: isRead
    }).then(notificationsFound => {

        if (notificationsFound) {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`notifications`))
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Notifications`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update notifications`), err)
        );
    });
}

// Set the notification status ~ read or unread
function _setSingleNotificationReadStatus(notificationId, isRead) {
    Notification.findByIdAndUpdate(reviewId, {
        isRead: isRead
    }).then(notificationFound => {

        if (notificationFound) {
            return callback(
                Api.getResponse(true, FeedbackMessages.itemUpdatedSuccessfully(`notification`))
            );
        } else {
            return callback(
                Api.getError(FeedbackMessages.itemNotFound(`Notification`), null, 404)
            );
        }
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`update notification`), err)
        );
    });
}
/* 
    EXPORTS
*/
// Create notification
module.exports.createNotification = (notificationData, callback) => {
    const notification = new Notification(notificationData);

    notification.save().then(notificationCreated => {
        //TODO: Emit notification sent event
        return callback(
            Api.getResponse(true, FeedbackMessages.itemCreatedSuccessfully(`Notification`), reviewCreated)
        );
    }).catch(err => {
        return callback(
            Api.getError(FeedbackMessages.operationFailed(`create notification`), err)
        );
    });
};

// View user notifications for the currently logged in user
module.exports.getUserNotifications = (userId, callback) => {
    return _getNotificationsByFilter({
        user: userId
    }, callback);
};

// Mark a specific notification as read
module.exports.markNotificationAsRead = (notificationId, callback) => {
    return _setSingleNotificationReadStatus(notificationId, true, callback);
};

// Mark a specific notification as unread
module.exports.markNotificationAsUnread = (notificationId, callback) => {
    return _setSingleNotificationReadStatus(notificationId, false, callback);
};

// Mark all current user notifications as read
module.exports.markUserNotificationsAsRead = (userId) => {
    return _setUserNotificationsReadStatus(userId, true);
};