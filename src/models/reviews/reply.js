const mongoose = require('mongoose');
const moment = require('moment');

// Models referenced by this schema
require('../reviews/review');
require('../users/user');

const reviewReplySchema = new mongoose.Schema({
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

module.exports = new mongoose.model('ReviewReply', reviewReplySchema);