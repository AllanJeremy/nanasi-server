const mongoose = require('mongoose');
const PaymentMethods = require('../config/paymentMethods');

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
    }
});

// Exports
module.exports = mongoose.model('BillingInfo', billingInfoSchema);