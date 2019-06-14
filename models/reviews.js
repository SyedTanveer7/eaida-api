const mongoose = require("mongoose");

const ReviewsSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bookingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking"
    },
    message: {
        type: String
    },
    starCount: {
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

module.exports = mongoose.model("Reviews", ReviewsSchema);