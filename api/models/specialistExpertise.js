const mongoose = require("mongoose");

const SpecialistExpertiseSchema = new mongoose.Schema({
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    caseCategory: {
        type: String
    },
    caseName: {
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

module.exports = mongoose.model("SpecialistExpertise", SpecialistExpertiseSchema);