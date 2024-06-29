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
                message: 'User History Added'
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
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
                    message: 'Users History Not Found',
                })
            }

            return res.status(200).json({
                data: history.history
            })


        } catch (error) {
            return res.status(500).json({
                message: "error",
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
                    message: 'Users Score Not Found',
                })
            }

            return res.status(200).json({
                totalScore: history.totalScore
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    },

    getUsersData: async (req, res) => {
        const { search, sort } = req.query
        const queryObj = { role: "user" }

        if (search) {
            queryObj.fullName = { $regex: search, $options: "i" }
        }

        const getList = User.find(queryObj)

        if (sort && sort != 'totalScore' && sort != '-totalScore') {
            getList.sort(sort)
        }

        try {
            const usersList = await getList.lean()
            const getScore = await History.find().lean()

            const userData = usersList.map((user) => {
                const filterUser = getScore.filter((score) => user._id == score.userId)
                const totalScore = filterUser.length !== 0 ? filterUser[0].totalScore : 0
                return { ...user, totalScore: totalScore }
            })

            if (sort == 'totalScore') {
                userData.sort((a, b) => a.totalScore - b.totalScore)
            }

            if (sort == '-totalScore') {
                userData.sort((a, b) => b.totalScore - a.totalScore);
            }

            return res.status(200).json({
                data: userData
            })

        } catch (error) {
            return res.status(500).json({
                message: "error",
                error,
            })
        }
    }
}