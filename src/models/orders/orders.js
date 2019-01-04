const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    // User that ordered the product
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    itemCount: Number,// Number of items ordered
    
    // The different products in the order
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: { // Number of these items ordered
            type: Number, 
            default: 1
        },
        
        isFulfilled: Boolean // Whether this order item has been delivered
    }],

    dateOrdered: Date,

    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }
});

// Exports
module.exports = mongoose.model('Store',orderSchema);