const mongoose = require('mongoose');

// Schema
const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store'
    },

    name: {
        type: String,
        required: true
    },
    description: String,

    regularPrice: {
        type: Number,
        required: true
    },
    salePrice: Number,
    tax: Number,

    quantity: {
        type: Number,
        required: true
    },

    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
    }],

    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant'
    }],

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    tags: [String]
});

// Exports
module.exports = mongoose.model('Product', productSchema);