const mongoose = require("mongoose");

const Tutorial = mongoose.model(
    "Tutorial",
    new mongoose.Schema({
        title: String,
        author: String,
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    })
);

module.exports = Tutorial;