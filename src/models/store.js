const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    //Type of product the store is expected to sell
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true
    }
});

// Exports
module.exports = mongoose.model('Store',storeSchema);