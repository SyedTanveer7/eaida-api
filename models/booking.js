const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    menu: {
        type: String,
        enum: [ 'Doctor', 'Nurse', 'Therapist', 'Veterinary', 'Laboratory']
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
            enum: [ 'Patient', 'Doctor', 'Nurse', 'Therapist', 'Veterinary', 'Laboratory']
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