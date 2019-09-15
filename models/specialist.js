const mongoose = require("mongoose");

const SpecialistSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    consultationFee: {
        type: String
    },
    university: {
        type: String
    },
    associatedHospital: {
        type: String
    },
    experience: {
        type: String
    },
    nameTitle: {
        type: String
    },
    licenseNumber: {
        type: String
    },
    about: {
        type: String
    },
    languages: {
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

module.exports = mongoose.model("Specialist", SpecialistSchema);