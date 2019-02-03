const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // User that ordered the product
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },

    quantity: { // Number of these items ordered
        type: Number,
        default: 1
    },

    isAccepted: {
        type: Boolean,
        default: true,
        reason: String // Reason we declined the order if any
    },

    isFulfilled: {
        type: Boolean,
        default: false
    }, // Whether this order item has been delivered

    isCancelled: {
        type: Boolean,
        default: false
    },

    dateOrdered: {
        type: Date,
        default: Date.now() //TODO: Use moment
    },

    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
});

// Exports
module.exports = mongoose.model('Order', orderSchema);