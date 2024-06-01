const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user")
const bcrypt = require("bcrypt");
const Credential = require("../models/credential");
const Session = require("../models/session");
const { DateTime } = require("luxon");


module.exports = {
    registerUser: async (req, res) => {
        const { fullName, email, password } = req.body;

        try {
            // Create User In DataBase
            const user = await User.create({
                fullName,
                email,
                role: 'user'
            });

            // Encrypt Password And Store In DataBase
            const encryptedPassword = await bcrypt.hash(password, 10);
            await Credential.create({
                userId: user._id,
                password: encryptedPassword,
            });

            // Generate Jwt Token And Store In DataBase
            const tokenObj = {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            };
            const expireTime = 3 * 60 * 60;
            const jwtToken = jsonwebtoken.sign(
                tokenObj,
                process.env.JWT_SECRET_KEY,
                { expiresIn: expireTime }
            );
            await Session.create({
                userId: user._id,
                token: jwtToken,
                status: 'current',
                loginAt: DateTime.utc(),
                expireAt: DateTime.utc().plus({ hours: 3 })
            });

            return res.status(201).json({
                user,
                token: jwtToken
            });
        } catch (error) {
            return res.status(500).json({
                massage: "User Not Register",
                error: error,
            });
        };
    },

    loginUser: async (req, res) => {
        const { email, password } = req.body

        try {
            // Find user is exist or not
            const user = await User.findOne({ email: email }).lean()
            if (!user) {
                return res.status(404).json({
                    massage: 'User not found. Please try again with different email.'
                });
            };

            // Get password and check is correct or not
            const credential = await Credential.findOne({ userId: user._id })
            const checkPassword = await bcrypt.compare(password, credential.password)
            if (!checkPassword) {
                return res.status(401).json({
                    massage: 'Invalid Password.'
                });
            };

            // Generate Jwt Token And Update In Session DataBase
            const tokenObj = {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            };
            const expireTime = 3 * 60 * 60;
            const jwtToken = jsonwebtoken.sign(tokenObj, process.env.JWT_SECRET_KEY, { expiresIn: expireTime })
            await Session.findOneAndUpdate(
                { userId: user._id, },
                {
                    userId: user._id,
                    token: jwtToken,
                    status: 'current',
                    loginAt: DateTime.utc(),
                    expireAt: DateTime.utc().plus({ hours: 3 }),
                },
            );

            return res.status(200).json({
                user,
                token: jwtToken
            });

        } catch (error) {
            return res.status(500).json({
                massage: "error",
                error,
            });
        };
    },

    checkWhoIs: (req, res) => {
        const { loggedInUserData } = req;
        res.status(200).json({
            user: loggedInUserData["user"],
            session: loggedInUserData["session"]
        });
    },

    logOutUser: async (req, res) => {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                massage: 'sessionId Required'
            });
        };

        try {
            const getSession = await Session.findById(sessionId);

            if (!getSession) {
                return res.status(404).json({
                    massage: 'sessionId not found'
                });
            };

            if (getSession.status == 'expired') {
                return res.status(200).json({
                    massage: 'Token Already Expired'
                });
            };

            await Session.findByIdAndUpdate(
                sessionId,
                { status: 'expired' },
                { new: true }
            )

            return res.status(200).json({
                massage: "Logout Successful.",
            });

        } catch (error) {
            return res.status(500).json({
                massage: "Internal Server Error",
                error
            });
        };
    },

    changePassword: async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const { loggedInUserData: { user } } = req;

        try {
            const { password, _id } = await Credential.findOne({ userId: user._id });
            const checkPassword = await bcrypt.compare(currentPassword, password);
            if (!checkPassword) {
                return res.status(400).json({
                    massage: 'Current password you entered is incorrect.'
                });
            };

            const encryptedPassword = await bcrypt.hash(newPassword, 10);
            const upadetPassword = await Credential.findByIdAndUpdate(
                _id,
                {
                    password: encryptedPassword,
                },
                { new: true }
            );
            if (!upadetPassword) {
                return res.status(404).json({
                    massage: 'User Not Found'
                });
            };

            return res.status(200).json({
                massage: "Password changed successful.",
            });

        } catch (error) {
            return res.status(500).json({
                massage: "Internal Server Error",
                error
            });
        };
    },
}