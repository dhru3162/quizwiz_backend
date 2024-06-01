const User = require("../models/user");
const { EMAIL_PATTERN, PASSWORD_PATTERN } = require("../util/constant");

const userRegisterValidation = async (req, res, next) => {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        return res.status(400).json({
            massage: 'Provide All Required Feilds',
            ["exp."]: {
                fullName: "string",
                email: "string",
                password: "string"
            }
        })
    }

    if (typeof fullName !== 'string') {
        return res.status(400).json({
            massage: 'Full name must be a string and at least 5 characters',
        })
    }

    const registerdUsers = await User.findOne({ email: email })

    if (registerdUsers) {
        return res.status(400).json({
            massage: 'This email already registerd',
        })
    }

    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
        return res.status(400).json({
            massage: 'Invalid email address',
        })
    }

    if (typeof password !== 'string' || password.length < 8 || !PASSWORD_PATTERN.test(password)) {
        return res.status(400).json({
            massage: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        })
    }

    next()
}

const userLoginValidation = (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            massage: 'Provide All Required Feilds',
            ["exp."]: {
                email: "string",
                password: "string"
            }
        })
    }

    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
        return res.status(400).json({
            massage: 'Invalid email address',
        })
    }

    if (typeof password !== 'string' || password.length < 8 || !PASSWORD_PATTERN.test(password)) {
        return res.status(400).json({
            massage: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        })
    }

    next()
}

module.exports = {
    userRegisterValidation,
    userLoginValidation,
}