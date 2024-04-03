const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlenght: 6,
        required: true,
    },
    createdAt: {
        type: Date,
        default: new Date,
    }
})

const User = mongoose.model('users', UserSchema);

module.exports = User; 