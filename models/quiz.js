const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        totalQuestions: {
            type: Number,
            required: true,
        },
        time: {
            type: Number,
            required: true,
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true
                },
                options: [{
                    type: String,
                    required: true
                }],
                correctAnswers: [
                    {
                        type: String,
                        required: true
                    }
                ]
            }
        ],
    },
    {
        timestamps: true,
    })

const Quiz = mongoose.model('quiz', QuizSchema);

module.exports = Quiz; 