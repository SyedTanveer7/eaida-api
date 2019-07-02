const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
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