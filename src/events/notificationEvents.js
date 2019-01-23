//* Emits & broadcasts notification events
const io = require('socket.io');
const EventConfig = require('../config/events');

// Emit event when notification is created ~ Sends the notification through
module.exports.emitNotificationSent = (userId, notification) => {
    io.on('connection', (socket) => {
        io.emit(EventConfig.events.NOTIFICATION_SENT); //TODO: Only broadcast to the user provided
    });
};