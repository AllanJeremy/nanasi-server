const mongoose = require('mongoose');
const PaymentMethods = require('../config/paymentMethods');

require('./users/address');

const billingInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    paymentMethod: {
        type: String,
        default: PaymentMethods.MPESA
    },
    details: {
        type: Object,
        default: {}
    }
});

// Exports
module.exports = mongoose.model('BillingInfo', billingInfoSchema);