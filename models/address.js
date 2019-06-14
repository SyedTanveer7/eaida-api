const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        trim: true
    },
    coordinates: {
        type: String,
        trim: true
    },
	addressLine1: {
        type: String,
        trim: true
    },
    addressLine2: {
        type: String,
        trim: true
    },
    cityTown: {
        type: String,
        trim: true
    },
    stateProvinceRegion: {
        type: String,
        trim: true
    },
    zipPostalCode: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
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

module.exports = mongoose.model("Address", AddressSchema);