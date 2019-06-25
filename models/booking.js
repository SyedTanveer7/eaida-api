const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    patient: {
        relation: {
            type: String
        },
        forWho: {
            type: String
        }
    },
    menu: {
        type: String,
        enum: ['Cadiologist', 'Nurse', 'Physical Therapist', 'Veterinarian', 'Caregiver', 'Dermatologist', 'Ent', 'Family Medicine', 'Gastroenterologist', 'General Practitioner', 'General Surgeon', 'Internal Medicine', 'Medtech', 'Midwife', 'Nephrologist', 'Neurologist', 'Nursing Aid', 'Obstetricts Gynecology', 'Ocupational Medicine', 'Ophthalmologist', 'Orthopedic Surgeon', 'Pediatrician', 'Phlebotomist', 'Psychiatrist', 'Pulmonologist', 'Rehab Med', 'Urologist']
    },
    scheduleDateTime: {
        type: Date
    },
    patientAddressID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    specialistID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    payment: {
        refID: {
            type: String
        }
    },
    status: {
        label: {
            type: String,
            enum: [ 'Declined', 'Approved', 'Done', 'Completed', 'Cancelled' ]
        },
        triggeredBy: {
            type: String,
            enum: ['Patient', 'Cadiologist', 'Nurse', 'Physical Therapist', 'Veterinarian', 'Caregiver', 'Dermatologist', 'Ent', 'Family Medicine', 'Gastroenterologist', 'General Practitioner', 'General Surgeon', 'Internal Medicine', 'Medtech', 'Midwife', 'Nephrologist', 'Neurologist', 'Nursing Aid', 'Obstetricts Gynecology', 'Ocupational Medicine', 'Ophthalmologist', 'Orthopedic Surgeon', 'Pediatrician', 'Phlebotomist', 'Psychiatrist', 'Pulmonologist', 'Rehab Med', 'Urologist']
        },
        specialistCurrentCoordinates: {
            type: String
        },
        triggeredAt: {
            type: Date
        },
        declineReason: {
            type: String
        }
    },
    reports: {
        diagnosis: {
            type: String
        },
        comment: {
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

module.exports = mongoose.model("Booking", BookingSchema);