const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        forgotPasswordKey: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const Credential = mongoose.model('credential', CredentialSchema);

module.exports = Credential; 