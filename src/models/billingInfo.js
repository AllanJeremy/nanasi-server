const mongoose = require('mongoose');

const billingInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
    //TODO: Add payment method or extra billing info
});

// Exports
module.exports = mongoose.model('BillingInfo',billingInfoSchema);