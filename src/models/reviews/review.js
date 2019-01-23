const mongoose = require('mongoose');
const moment = require('moment');

const reviewSchema = new mongoose.Schema({
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