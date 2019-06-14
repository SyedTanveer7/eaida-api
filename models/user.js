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
	roles: {
        type: String,
        enum: ['Patient', 'Doctor', 'Nurse', 'Therapist', 'Veterinary', 'Laboratory'],
        default: 'Patient'
    },
    imgURL: {
        type: String,
        trim: true,
    },
    specialist: {
        info: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Specialist"
        },
        reviewStarCount: {
            type: String,
            default: '0.0'
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

module.exports = mongoose.model("User", UserSchema);