const mongoose = require('mongoose');

const mailBoxSchema = new mongoose.Schema({
    organisationId: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    sub: {
        type: String,
    },
    body: {
        type: String,
        required: true,
    },
    attachments: {
        type: [String],

    },
    to: {
        type: [String],
        require: true,
    },
    cc: {
        type: [String],
    },
    bb: {
        type: [String]
    },
    isExternal: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    sentDate: {
        type: Date,
        default: Date.now,
    },
    seen: {
        type: [String],
        default: [],
    },
    starred: {
        type: Boolean,
        default: false,
    },
    deletedFor: {
        type: [String],
        default: [],
    }
}, 
{timestamps: true},
);

module.exports = mongoose.model("MailBox", mailBoxSchema);