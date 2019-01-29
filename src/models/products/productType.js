const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
}, {
    collection: 'productTypes'
});

// Exports
module.exports = mongoose.model('ProductType', productTypeSchema);