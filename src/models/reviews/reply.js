const mongoose = require('mongoose');
const moment = require('moment');

const reviewReplySchema = new mongoose.Schema({
    review: {
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

module.exports = new mongoose.model('ReviewReply', reviewReplySchema);