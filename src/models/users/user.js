const mongoose = require('mongoose');

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
        required: true
    },
    email: String,
    accountType: {
        type:String,
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
    isLocked: {// Can we login to this account
        type: Boolean, 
        default: false
    },
    isActive: { // Can this account be used to perform any actions
        type: Boolean,
        default: true
    }
});

// Exports
module.exports = mongoose.model('User',userSchema);