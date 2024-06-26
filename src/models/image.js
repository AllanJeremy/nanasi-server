const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    imageUrl: String,
    thumbnailUrl: String,
    altText: String,
});


// Exports
module.exports = mongoose.model("Image", imageSchema);