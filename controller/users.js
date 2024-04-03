const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user")
const bcrypt = require("bcrypt")

module.exports = {
    registerUser: async (req, res) => {
        const user = new User(req.body);
        user.password = await bcrypt.hash(req.body.password, 10);
        try {
            const response = await user.save();
            response.role = 'user'
            response.password = undefined;
            return res.status(201).json({
                massage: 'User registered Successfully',
                data: response,
            })
        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error: error,
            })
        }
    },
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if (!user) {
                return res.status(404).json({
                    massage: 'User not found. Please try again with different email.'
                })
            }
            const checkPassword = await bcrypt.compare(req.body.password, user.password)
            if (!checkPassword) {
                return res.status(401).json({
                    massage: 'Wrong Password'
                })
            }

            const tokenObj = {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
            const jwtToken = jsonwebtoken.sign(tokenObj, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
            // user.accessToken = jwtToken
            return res.status(200).json({
                data: { user, accessToken: jwtToken },
            })

        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error: error,
            })
        }
    },
    checkWhoIs: (req, res) => {
        const { loggedInUserData } = req;
        res.status(200).json({
            user: loggedInUserData["user"],
        });
    }
}