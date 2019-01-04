const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    _id: mongooose.Schema.Types.ObjectId,
    imageUrl: String,
    thumbnailUrl: String,
    altText: String,
    variantId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Variant'
    }
});


// Exports
module.exports = mongoose.model('Image',imageSchema);