const History = require("../models/history")
const User = require("../models/user")

module.exports = {
    addHistory: async (req, res) => {
        const { quizData, score, result, percentage } = req.body
        const { loggedInUserData: { user } } = req

        try {
            const history = await History.findOne({ userId: user._id })

            if (history) {
                await History.findByIdAndUpdate(
                    { _id: history._id },
                    {
                        $inc: { totalScore: score },
                        $push: {
                            history: {
                                quizData,
                                score,
                                result,
                                percentage
                            }
                        }
                    },
                    { new: true }
                )
            } else {
                await History.create({
                    userId: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    totalScore: score,
                    history: [
                        {
                            quizData,
                            score,
                            result,
                            percentage
                        }
                    ]
                })
            }

            return res.status(201).json({
                massage: 'User History Added'
            })

        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    },
    getHistory: async (req, res) => {
        const { loggedInUserData: { user } } = req

        try {
            const history = await History.findOne({ userId: user._id })

            if (!history) {
                return res.status(404).json({
                    massage: 'Users History Not Found',
                })
            }

            return res.status(200).json({
                data: history.history
            })


        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    },
    getScore: async (req, res) => {
        const { loggedInUserData: { user } } = req

        try {
            const history = await History.findOne({ userId: user._id })

            if (!history) {
                return res.status(404).json({
                    massage: 'Users Score Not Found',
                })
            }

            return res.status(200).json({
                totalScore: history.totalScore
            })

        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    },
    getUsersData: async (req, res) => {
        try {
            const allUsersList = await User.find({ role: "user" }).lean()
            // const removedAdmin = allUsersList.filter((user) => user.role != 'admin')

            return res.status(200).json({
                data: allUsersList
            })

        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            })
        }
    }
}