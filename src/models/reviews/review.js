const mongoose = require("mongoose");
const moment = require("moment");

// Models referenced by this schema
require("../products/product");
require("../users/user");

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    dateUpdated: {
        type: Date,
        default: moment().unix()
    }
});

module.exports = new mongoose.model("Review", reviewSchema);