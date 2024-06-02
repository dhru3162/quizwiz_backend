const jwt = require("jsonwebtoken");
const User = require("../models/user")
const bcrypt = require("bcrypt");
const Credential = require("../models/credential");
const Session = require("../models/session");
const { DateTime } = require("luxon");
const nodemailer = require("nodemailer");

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
            const expireTime = 15 * 24 * 60 * 60;
            const jwtToken = jwt.sign(
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
                massage: "Internal Server Error",
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
            const expireTime = 15 * 24 * 60 * 60;
            const jwtToken = jwt.sign(tokenObj, process.env.JWT_SECRET_KEY, { expiresIn: expireTime })
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
                massage: "Internal Server Error",
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

    forgotPassword: async (req, res) => {
        const { email } = req.body;

        try {
            // Find user is exist or not
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    massage: 'Email id not registered.'
                });
            };

            const tokenObj = {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            };
            const expireTime = 1 * 60 * 60;
            const jwtToken = jwt.sign(tokenObj, process.env.JWT_SECRET_KEY, { expiresIn: expireTime });

            await Credential.findOneAndUpdate(
                {
                    userId: user._id,
                },
                {
                    forgotPasswordKey: true,
                }
            );

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: "smtp.gmail.email",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GOOGLE_USERID,
                    pass: process.env.GOOGLE_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: '"QuizWiz Team" <quizwiz@gmail.com>',
                to: user.email,
                subject: "Reset your quizwiz account password",
                html: `
                <div style="font-family: Arial, sans-serif;">
                    <div class="email-container" style="max-width: 600px; border: 1px solid #2D3250; background-color: #EEEEEE; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                        <div class="header" style="text-align: center;">
                            <img src="https://i.ibb.co/PTmmcnD/Logo.png" alt="Company Logo" style="max-width: 150px; margin-top: 10px;">
                        </div>
                        <div class="content" style="padding: 10px 0 0 0;">
                            <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
                            <p style="padding: 20px 10px 0 10px; font-size: 16px; line-height: 1.5; color: #333333;">Hello ${user?.fullName},</p>
                            <p style="padding: 0 10px 0 10px; font-size: 16px; line-height: 1.5; color: #333333;">You have requested to reset your password. Click the button below to set a new password for your account. This link is valid for only 1 hour. If you have questions contact support team.</p>
                        </div>
                        <div class="button-container" style="text-align: center; margin: 30px 0;">
                            <a href="https://quizwiz-by-dhru3162.vercel.app/forgot-password/${jwtToken}" target="_blank" style="background-color: #2D3250; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">Reset Your Password</a>
                        </div>
                        <div class="footer" style="text-align: center; font-size: 12px; color: #777777; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                            <p style="margin: 0;">If you did not request this password reset, please ignore this email or <a href="https://quizwiz-by-dhru3162.vercel.app/contact_us" style="color: #0C356A; text-decoration: none;">contact support</a>.</p>
                            <p style="margin: 0;">© 2024 Quizwiz. All rights reserved.</p>
                        </div>
                    </div>
                </div>
                `,
            });

            return res.status(200).json({
                success: true,
            });

        } catch (error) {
            return res.status(500).json({
                massage: "Internal Server Error",
                error
            });
        }
    },

    checkLink: async (req, res) => {
        const { token } = req.body;

        if (!token || token === "") {
            return res.status(400).json({
                massage: 'Bad Request'
            })
        }

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const password = await Credential.findOne({ userId: decodedToken._id }).lean();
            if (!password?.forgotPasswordKey) {
                return res.status(401).json({
                    massage: 'token expired'
                });
            };

            return res.status(200).json({
                success: true,
            });

        } catch (error) {
            return res.status(401).json({
                massage: 'token expired'
            });
        };
    },

    ResetPassword: async (req, res) => {
        const { token, newPassword } = req.body;
        console.log('newPaassword: ', newPassword);

        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const encryptedPassword = await bcrypt.hash(newPassword, 10);
            await Credential.findOneAndUpdate(
                {
                    userId: decodedToken._id,
                },
                {
                    forgotPasswordKey: false,
                    password: encryptedPassword,
                }
            );

            return res.status(200).json({
                massage: "Password changed successful.",
            });

        } catch (error) {
            return res.status(401).json({
                massage: 'token expired'
            });
        }
    }
};