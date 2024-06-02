const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Session = require("../models/session");
const { PASSWORD_PATTERN, EMAIL_PATTERN } = require("../util/constant");

const authenticate = async (req, res, next) => {

    if (!req.headers['authorization']) {
        return res.status(401).json({
            massage: 'Unauthorized User'
        })
    }

    try {
        const token = req.headers["authorization"].replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Get User Data
        const user = await User.findOne({ email: decodedToken.email });
        if (!user) {
            return res.status(401).json({
                massage: 'User Not Found'
            })
        };

        // Check Session Expired Or Not
        const session = await Session.findOne({
            userId: user._id
        });
        if (!session || session.status === 'expired' || session.token != token) {
            return res.status(401).json({
                massage: 'jwt token expired'
            })
        }

        req.loggedInUserData = {};
        req.loggedInUserData['user'] = user;
        req.loggedInUserData['session'] = session;
        next();
    } catch (error) {
        return res.status(401).json({
            massage: 'jwt token expired',
            error
        })
    }
};

const changePasswordValidate = (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    try {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                massage: 'Provide All Required Feilds',
                ["exp."]: {
                    currentPassword: "string",
                    newPassword: "string",
                    confirmNewPassword: "string"
                }
            });
        };

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                massage: 'new password and confirmation password do not match.',
            });
        };

        if (currentPassword === newPassword) {
            return res.status(400).json({
                massage: 'new password must be different from the current password.',
            });
        };

        if (typeof newPassword !== 'string' || newPassword.length < 8 || !PASSWORD_PATTERN.test(newPassword)) {
            return res.status(400).json({
                massage: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
            });
        };

        next();
    } catch (error) {
        return res.status(500).json({
            massage: "error",
            error,
        });
    };
};

const ResetPasswordValidate = (req, res, next) => {
    const { confirmNewPassword, newPassword, token } = req.body;

    try {
        if (!confirmNewPassword || !newPassword || !token) {
            return res.status(400).json({
                massage: 'Provide All Required Feilds',
                ["exp."]: {
                    confirmNewPassword: "string",
                    newPassword: "string",
                    token: "string"
                }
            });
        };

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                massage: 'new password and confirmation password do not match.',
            });
        };

        if (typeof newPassword !== 'string' || newPassword.length < 8 || !PASSWORD_PATTERN.test(newPassword)) {
            return res.status(400).json({
                massage: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
            });
        };

        next();
    } catch (error) {
        return res.status(500).json({
            massage: "error",
            error,
        });
    };
};

const forgotPasswordValidation = (req, res, next) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                massage: `Email id required`,
            });
        };

        if (!EMAIL_PATTERN.test(email)) {
            return res.status(400).json({
                massage: `Invalid email id`,
            });
        };
        next();

    } catch (error) {
        return res.status(500).json({
            massage: "error",
            error,
        });
    };
};

module.exports = {
    authenticate,
    changePasswordValidate,
    forgotPasswordValidation,
    ResetPasswordValidate,
};