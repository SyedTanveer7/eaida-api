const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        unique: true, 
        required: true
    },
    webAuth: {
        facebook: {
            id: String,
            token: String
        }
    },
    mobileAuth: {
        manual: {
            token: String,
            createdAt: {
                type: Date
            },
            expiredAt: Date
        }
    },
	firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
	middleName: {
        type: String,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    birthDate: {
        type: Date
    },
	roles: {
        type: String,
        enum: ['Administrator', 'Patient', 'Cardiologist', 'Nurse', 'Physical Therapist', 'Veterinarian', 'Caregiver', 'Dermatologist', 'Ent', 'Family Medicine', 'Gastroenterologist', 'General Practitioner', 'General Surgeon', 'Internal Medicine', 'Medtech', 'Midwife', 'Nephrologist', 'Neurologist', 'Nursing Aid', 'Obstetricts Gynecology', 'Ocupational Medicine', 'Ophthalmologist', 'Orthopedic Surgeon', 'Pediatrician', 'Phlebotomist', 'Psychiatrist', 'Pulmonologist', 'Rehab Med', 'Urologist'],
        default: 'Patient'
    },
    imgURL: {
        type: String,
        trim: true,
    },
    identification: {
        passport: {
            url: {
                type: String,
                trim: true,
            },
            number: {
                type: String,
                trim: true,
            }
        },
        emirates: {
            url: {
                type: String,
                trim: true,
            },
            number: {
                type: String,
                trim: true,
            }
        },
        insurance: {
            url: {
                type: String,
                trim: true,
            },
            number: {
                type: String,
                trim: true,
            }
        }
    },
    specialist: {
        info: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Specialist"
        },
        weeklySchedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SpecialistWeeklySchedule"
        },
        availableBalance: {
            type: String
        },
        reviewStarCount: {
            type: String,
            default: '0.0'
        }
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    loginStatus: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: {
        type: Date
    },
    blockedAt: {
        type: Date
    },
    deleteAt: {
        type: Date
    }
});

module.exports = mongoose.model("User", UserSchema);