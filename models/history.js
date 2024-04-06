const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        totalScore: {
            type: Number,
            required: true,
            default: 0,
        },
        history: [
            {
                quizData: {
                    type: Object,
                    required: true,
                },
                score: {
                    type: Number,
                    required: true,
                },
                result: {
                    type: Array,
                    required: true,
                },
                percentage: {
                    type: Number,
                    required: true,
                }
            }
        ],
    },
    {
        timestamps: true,
    }

)

const History = mongoose.model('histories', HistorySchema)

module.exports = History;