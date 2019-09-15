const mongoose = require("mongoose");

const CardDetailsSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cardHolderName: {
        type: String,
    },
    cardNumber: {
        type: String
    },
    expiryDate: {
        type: String
    },
    cvc: {
        type: String
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

module.exports = mongoose.model("CardDetails", CardDetailsSchema);