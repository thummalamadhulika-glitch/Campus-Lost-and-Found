
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

    type: {
        type: String,
        enum: ["Lost", "Found"],
        required: true
    },

    itemName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    image: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        default: "Available"
    },

    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
