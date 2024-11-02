const mongoose = require("mongoose");

const authModel = mongoose.Schema({
    organisationName: {
        type: String,
        required: true,
    },
    personalMail: {
        type: String,
        unique: true,
        required: true,
    },
    mail: {
        type: String,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        unique: true,
    },
    empId: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        minLength: 8,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    permission: {
        type: [String],
    },
    appPassword: {
        type: String,
        default: null,
    },
    pushNotifyId: {
        type: String,
        default: null,
    },
});

module.exports = mongoose.model("auth", authModel);