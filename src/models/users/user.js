const mongoose = require('mongoose');
const moment = require('moment');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    email: String,
    accountType: {
        type: String,
        required: true
    },

    isLoggedIn: {
        type: Boolean,
        default: false
    },
    lastLogin: Date,
    remember: Boolean,

    createdOn: {
        type: Date,
        default: moment().unix()
    },

    failedAttempts: Number,
    isLocked: { // Can we login to this account
        type: Boolean,
        default: false
    },
    otp: {
        password: String,
        otpType: String,
        expiry: Date
    },

    registrationConfirmed: {
        type: Boolean,
        default: false
    },
    isActive: { // Can this account be used to perform any actions
        type: Boolean,
        default: false
    },

});

// Exports
module.exports = mongoose.model('User', userSchema);