const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: String,
    quantity: {
        type: Number,
        default: 1
    },
    regularPrice: Number,
    salePrice: Number,
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    }],
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

// Exports
module.exports = mongoose.model('Variant', variantSchema);