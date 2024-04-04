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
                massage: "error",
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
                    massage: 'Quiz Not Found'
                })
            } else {
                return res.status(200).json({
                    data: quiz,
                })
            }
        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    },

    addQuiz: async (req, res) => {
        try {
            const quiz = await Quiz.create(req.body);
            return res.status(201).json({
                massage: 'New Quiz Added Successfully',
                data: quiz,
            })
        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    },

    updateQuiz: async (req, res) => {
        const id = req.params.id
        const data = req.body

        try {
            const quiz = await Quiz.findByIdAndUpdate(id, data);
            if (!quiz) {
                return res.status(404).json({
                    massage: 'Quiz Not Found'
                })
            } else {
                return res.status(200).json({
                    massage: "Quiz Updated Successfully.",
                    data: await Quiz.findById(id),
                })
            }

        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    },

    deleteQuiz: async (req, res) => {
        const id = req.params.id
        try {
            const quiz = await Quiz.findByIdAndDelete(id);
            if (!quiz) {
                return res.status(500).json({
                    massage: "Quiz Not Found",
                })
            } else {
                return res.status(200).json({
                    massage: "Quiz Deleted Successfully.",
                })
            }

        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    }
}