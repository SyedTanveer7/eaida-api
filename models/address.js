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
	area: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    street: {
        type: String,
        trim: true
    },
    building: {
        type: String,
        trim: true
    },
    floor: {
        type: String,
        trim: true
    },
    additionalDirection: {
        type: String,
        trim: true
    },
    mobileNumber: {
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