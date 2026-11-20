
const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({

    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }

}, { timestamps: true });

const Claim = mongoose.model("Claim", claimSchema);

module.exports = Claim;
