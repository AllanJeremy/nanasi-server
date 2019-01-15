const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
    merchant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
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