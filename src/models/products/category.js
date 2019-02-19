const mongoose = require("mongoose");

require("./productType");

const categorySchema = new mongoose.Schema({
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductType"
    },

    name: {
        type: String,
        required: true,
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }
}, {
    collection: "categories"
});

module.exports = mongoose.model("Category", categorySchema);