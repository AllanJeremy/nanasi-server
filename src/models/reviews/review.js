const mongoose = require('mongoose');
const moment = require('moment');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
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

module.exports = new mongoose.model('Review', reviewSchema);