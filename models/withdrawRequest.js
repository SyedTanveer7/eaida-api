const mongoose = require("mongoose");

const CardDetailsSchema = new mongoose.Schema({
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cardID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CardDetails"
    },
    amount: {
        type: String
    },
    declineReason: {
        type: String
    },
    approvedAt: {
        type: Date
    },
    declinedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deleteAt: {
        type: Date
    }
});

module.exports = mongoose.model("WithdrawRequest", CardDetailsSchema);