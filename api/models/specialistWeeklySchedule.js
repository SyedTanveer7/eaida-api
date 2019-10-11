const mongoose = require("mongoose");

const SpecialistWeeklyScheduleSchema = new mongoose.Schema({
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    monday: { 
        status: {
            type: String
        },
        bookingCount: {
            type: String
        }
    },
    tuesday: { 
        status: {
            type: String
        },
        bookingCount: {
            type: String
        }
    },
    wednesday: { 
        status: {
            type: String
        },
        bookingCount: {
            type: String
        }
    },
    thursday: {
        status: {
            type: String
        },
        bookingCount: {
            type: String
        }
    },
    friday: { 
        status: {
            type: String
        },
        bookingCount: {
            type: String
        }
    },
    saturday: { 
        status: {
            type: String
        },
        bookingCount: {
            type: String
        }
    },
    sunday: { 
        status: {
            type: String
        },
        bookingCount: {
            type: String
        }
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

module.exports = mongoose.model("SpecialistWeeklySchedule", SpecialistWeeklyScheduleSchema);