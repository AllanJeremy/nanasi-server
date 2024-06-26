const mongoose = require("mongoose");

// Models referenced by this schema
require("../../models/image");
require("../../models/products/variant");
require("../../models/products/category");

// Schema
const productSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store"
    },

    name: {
        type: String,
        required: true
    },
    description: String,

    regularPrice: { //TODO: Account for currency (Consider adding currency to store)
        type: Number,
        required: true
    },
    salePrice: Number,
    tax: Number,

    cost: Number,
    quantity: {
        type: Number,
        default: 1
    },

    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
        default: []
    }],

    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant"
    }],

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    tags: [String]
});

// Exports
module.exports = mongoose.model("Product", productSchema);