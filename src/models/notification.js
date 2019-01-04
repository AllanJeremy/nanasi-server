const mongoose = require('mongoose');
const NotificationTypes = require('../config/notifications');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },

    actionLink: String,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    type: { // What type of notification is this
        type: String,
        default: NotificationTypes.Generic
    },

    isRead: {
        type: Boolean,
        default: false
    },

});

// Exports
module.exports = mongoose.model('Notification',notificationSchema);