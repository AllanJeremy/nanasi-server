const mongoose = require("mongoose");

require("./products/product");
require("./users/user");

const cartSchema = new mongoose.Schema({
    items: {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            dateAdded: {
                type: Date,
                default: Date.now()
            }
        }],
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    orderIsCompleted: { // Used to detect abandoned carts
        type: Boolean,
        default: false
    },
    isAbandoned: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Cart", cartSchema);