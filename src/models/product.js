const mongoose = require('mongoose');

// Schema
const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    store: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String
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
        _id: mongooose.Schema.Types.ObjectId,
        imageUrl: String,
        thumbnailUrl: String,
        altText: String,
        variantId: mongoose.Schema.Types.ObjectId
    }],

    variants: [{
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        quantity: Number,
        regularPrice: Number,
        salePrice: Number
    }],

    category: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        subcategory: {
            _id: mongoose.Schema.Types.ObjectId,
            name: String
        }
    },

    tags: [String]
});

// Exports
module.exports = mongoose.model('Product',productSchema);