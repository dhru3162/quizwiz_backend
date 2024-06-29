const Quiz = require("../models/quiz");

module.exports = {
    getQuiz: async (req, res) => {
        try {
            const quiz = await Quiz.find();
            return res.status(200).json({
                data: quiz,
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    getOneQuiz: async (req, res) => {
        const id = req.params.id
        try {
            const quiz = await Quiz.findById(id);
            if (!quiz) {
                return res.status(404).json({
                    message: 'Quiz Not Found'
                })
            } else {
                return res.status(200).json({
                    data: quiz,
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    addQuiz: async (req, res) => {
        const { title, description, totalQuestions, time, questions } = req.body

        if (!title || !description || !totalQuestions || !time || !questions) {
            return res.status(400).json({
                message: 'Provide All Required Feilds',
                ["exp."]: {
                    title: "string",
                    description: "string",
                    totalQuestions: "number",
                    time: 'number',
                    questions: "array"
                }
            })
        }

        try {
            const quiz = await Quiz.create(req.body);
            return res.status(201).json({
                message: 'New Quiz Added Successfully',
                data: quiz,
            })
        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    updateQuiz: async (req, res) => {
        const id = req.params.id
        const data = req.body

        try {
            const quiz = await Quiz.findByIdAndUpdate(id, data, { new: true });
            if (!quiz) {
                return res.status(404).json({
                    message: 'Quiz Not Found'
                })
            } else {
                return res.status(200).json({
                    message: "Quiz Updated Successfully.",
                    data: quiz,
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    deleteQuiz: async (req, res) => {
        const id = req.params.id
        try {
            const quiz = await Quiz.findByIdAndDelete(id);
            if (!quiz) {
                return res.status(404).json({
                    message: "Quiz Not Found",
                })
            } else {
                return res.status(200).json({
                    message: "Quiz Deleted Successfully.",
                })
            }

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    addQuestion: async (req, res) => {
        const id = req.params.id
        const question = req.body

        if (!id) {
            return res.status(400).json({
                message: "Quiz Id Required In Params",
            })
        }

        try {
            const updatedQuiz = await Quiz.findOneAndUpdate(
                { _id: id },
                {
                    $inc: { totalQuestions: 1 },
                    $push: { questions: question }
                },
                { new: true } // this line return updated values that reason i have add this
            );

            if (!updatedQuiz) {
                return res.status(404).json({
                    message: 'Quiz Not Found'
                })
            }

            return res.status(201).json({
                message: 'New Question Added Successful.',
                data: updatedQuiz,
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    editQuestion: async (req, res) => {
        const id = req.params.id
        const userRes = req.body

        if (!id) {
            return res.status(400).json({
                message: "Quiz Id Required In Params",
            })
        }

        if (!userRes._id) {
            return res.status(400).json({
                message: "Question Id Required In Body",
            })
        }

        try {
            const quizData = await Quiz.findById(id).lean()

            if (!quizData) {
                return res.status(404).json({
                    message: 'Quiz Not Found'
                })
            }

            const updatedQuiz = quizData?.questions.map((data) => {
                if (userRes._id == data._id) {
                    return userRes
                } else {
                    return data
                }
            })

            await Quiz.findByIdAndUpdate(id, { questions: updatedQuiz }, { new: true })

            return res.status(200).json({
                message: "Question Edited Successfully.",
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    deleteQuestion: async (req, res) => {
        const { quizId, questionId } = req.params

        if (!quizId || !questionId) {
            return res.status(400).json({
                message: `${!quizId ? "quizId" : "questionId"} required in params`,
            })
        }

        try {
            const deletedQuestion = await Quiz.findOneAndUpdate(
                { _id: quizId },
                {
                    $inc: { totalQuestions: -1 },
                    $pull: { questions: { _id: questionId } } // this is remove match id object 
                },
                { new: true } // this line return updated values that reason i have add this
            );

            if (!deletedQuestion) {
                return res.status(404).json({
                    message: 'Quiz Not Found'
                })
            }

            return res.status(200).json({
                message: "Question Deleted Successful.",
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    }
}