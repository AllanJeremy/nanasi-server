const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    addressLine1:{
        type: String,
        required: true
    },
    addressLine2: String,
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Country"
    },
    city:{
        type: String,
        required: true
    },
    state: { // State or province
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    zipCode: String,
});

// Exports
module.exports = mongoose.model("Address",addressSchema);