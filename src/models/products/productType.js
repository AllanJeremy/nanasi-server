const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    _id: mongooose.Schema.Types.ObjectId,

    name: {
        type: String,
        required: true,
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }
});


// Exports
module.exports = mongoose.model('ProductType',productTypeSchema);
