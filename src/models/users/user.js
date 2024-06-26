const mongoose = require("mongoose");
const OtpConfig = require("../../config/otp");

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
        default: Date.now()
    },

    failedAttempts: Number,
    isLocked: { // Can we login to this account
        type: Boolean,
        default: false
    },
    otp: {
        password: String,
        otpType: String,
        expiry: {
            type: Date,
            default: (Date.now() + OtpConfig.OTP_EXPIRY_TIME)
        }
    },
    registrationConfirmed: {
        type: Boolean,
        default: false
    },
    isActive: { // Can this account be used to perform any actions
        type: Boolean,
        default: false
    },
    balance: { //Account balance
        type: Number,
        default: 0
    }
});

// Exports
module.exports = mongoose.model("User", userSchema);