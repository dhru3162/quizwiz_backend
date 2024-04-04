const mongoose = require("mongoose");

const SessionSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'current',
        },
        loginAt: {
            type: Date,
            default: null,
        },
        expireAt: {
            type: Date,
            default: null,
        },
    }
);

const Session = mongoose.model('session', SessionSchema);

module.exports = Session; 