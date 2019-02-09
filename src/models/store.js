const mongoose = require("mongoose");

require('./image');
const storeSchema = new mongoose.Schema({
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    },

    //Type of product the store is expected to sell
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductType",
        required: true
    },

    balance: {
        type: Number,
        default: 0
    }
});

// Exports
module.exports = mongoose.model("Store", storeSchema);