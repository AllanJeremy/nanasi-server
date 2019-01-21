const Store = require('../models/store');
const notification = require('../modules/notifications/notifications');

function _acceptTransaction(notificationData) {
    // Get Nanasi's cut
    // Get store's cut
    // Send Nanasi cut to Nanasi app wallet
    // Add store's cut to store balance
    // Store transaction to the database

}

function _rejectTransaction(notificationData) {
    // Send notification to buyer - Failed to complete transaction
}

module.exports.handleCheckout = (notificationData) => {
    // Notification received, retrieve notification details

    // Check if the notification matches a valid store
    Store.findById(notificationData.metadata.storeId).then(storeFound => {
        if (storeFound) { //* Notification matches a valid store. Accept transaction
            _acceptTransaction(notificationData);
        } else { //* Notification does not match a valid store. Reject transaction
            _rejectTransaction();
        }
    });
}