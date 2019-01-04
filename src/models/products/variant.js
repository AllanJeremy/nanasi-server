const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    quantity: Number,
    regularPrice: Number,
    salePrice: Number,
    productId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
});

// Exports
module.exports = mongoose.model('Variant',variantSchema);