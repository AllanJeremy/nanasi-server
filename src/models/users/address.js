const mongoose = require("mongoose");

require("./user");

const addressSchema = new mongoose.Schema({
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: String,
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: { // State or province
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    zipCode: String,
});

// Exports
module.exports = mongoose.model("Address", addressSchema);