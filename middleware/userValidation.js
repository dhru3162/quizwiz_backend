const Joi = require("joi")

const emailPattern = /^[a-z0-9._-]+@[a-z0-9-]+\.[a-z]{2,4}$/i;
const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const userRegisterValidation = (req, res, next) => {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
        return res.status(400).json({
            massage: 'Provide All Feilds',
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

    if (typeof email !== 'string' || !emailPattern.test(email)) {
        return res.status(400).json({
            massage: 'Invalid email address',
        })
    }

    if (typeof password !== 'string' || password.length < 8 || !passwordPattern.test(password)) {
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
            massage: 'Provide All Feilds',
            ["exp."]: {
                email: "string",
                password: "string"
            }
        })
    }

    if (typeof email !== 'string' || !emailPattern.test(email)) {
        return res.status(400).json({
            massage: 'Invalid email address',
        })
    }

    if (typeof password !== 'string' || password.length < 8 || !passwordPattern.test(password)) {
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