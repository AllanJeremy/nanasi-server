const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType'
    },

    name: {
        type: String,
        required: true,
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
});

module.exports = mongoose.model('Category', categorySchema);