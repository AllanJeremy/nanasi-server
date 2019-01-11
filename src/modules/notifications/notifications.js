const Notification = require('../../models/notification');

/* 
    HELPERS
*/
//Get notifications by filter
// Get multiple notifications by filter
function _getNotificationsByFilter(filter, callback) {
    filter = filter || {};
    return Notification.find(filter)
        .populate('notification', 'name')
        .populate('user', '_id name')
        .then((notificationsFound) => {
            const notificationCount = notificationsFound.length;
            const isOk = (notificationCount > 0);
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFoundWithCount(notificationsFound, 'Notifications') : FeedbackMessages.itemNotFound('Notifications');

            return callback(
                Api.getResponse(isOk, message, {
                    count: notificationCount,
                    notifications: notificationsFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get notifications'), err)
            );
        });
}

// Get notification by filter
function _getSingleNotificationByFilter(filter, callback) {
    return Notification.findOne(filter)
        .populate('notification', 'name')
        .populate('user', '_id name')
        .then((NotificationFound) => {
            const isOk = NotificationFound ? true : false;
            const statusCode = isOk ? 200 : 404;
            const message = isOk ? FeedbackMessages.itemsFound('Notification') : FeedbackMessages.itemNotFound('Notification');

            return callback(
                Api.getResponse(isOk, message, {
                    notification: NotificationFound
                }, statusCode)
            );
        })
        .catch(err => {
            return callback(
                Api.getError(FeedbackMessages.operationFailed('get notifications'), err)
            );
        });
}
/* 
    EXPORTS
*/
// Create notification
module.exports.createNotification = (notificationData, callback) => {

};

// View user notifications for the currently logged in user
module.exports.getUserNotifications = (userId, callback) => {

};

// Mark all specific notification as read
module.exports.markNotificationAsRead = (userId, callback) => {

};

// Mark all current user notifications as read
module.exports.markUserNotificationsAsRead = (userId, callback) => {

};