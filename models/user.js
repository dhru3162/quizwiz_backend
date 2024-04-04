const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        }
    },
    {
        timestamps: true,
    })

const User = mongoose.model('users', UserSchema);

module.exports = User; 