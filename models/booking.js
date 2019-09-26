const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bookingReason: {
        type: String,
    },
    patientType: {
        type: String
    },
    familyMemberID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FamilyMember",
        default: null
    },
    addressID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    addressTitle: {
        type: String
    },
    caseName: {
        type: String
    },
    caseCategory: {
        type: String
    },
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    bookingDate: {
        type: Date
    },
    payment: {
        chargeID: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    specialistLocation: {
        lat: {
            type: String,
        },
        lng: {
            type: String,
        },
        createdAt: Date
    },
    notification: {
        for: {
            type: String,
            enum: ['Patient', 'Specialist', 'None']
        },
        message: String,
        createdAt: Date
    },
    reportID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report"
    },
    reviewID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    },
    scenario: {
        message1: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            }
        },
        message2: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            }
        },
        message3: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message4: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message5: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message6: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message7: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message8: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message9: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message10: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message11: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
        },
        message12: {
            code: {
                type: String
            },
            description_patient: {
                type: String
            },
            description_specialist: {
                type: String
            },
            trigger: {
                type: String
            },
            createdAt: {
                type: Date
            },
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

module.exports = mongoose.model("Booking", BookingSchema);