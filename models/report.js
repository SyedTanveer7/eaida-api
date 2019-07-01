const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    bookingID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        unique: true
    },
    mainComplaint: {
        type: String
    },
    impression: {
        type: String
    },
    historyAndAssessment: {
        type: String
    },
    plan: {
        type: String
    },
    medication: {
        type: String
    },
    watchOutFor: {
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

module.exports = mongoose.model("Report", ReportSchema);