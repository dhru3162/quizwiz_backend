const Joi = require("joi")

const userRegisterValidation = (req, res, next) => {
    const schema = Joi.object({
        fullName: Joi.string().required().min(5),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).alphanum().required()
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            massage: 'Bad Request',
            error
        })
    }
    next()
}

const userLoginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).alphanum().required()
    })
    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            massage: 'Bad Request',
            error
        })
    }
    next()
}

module.exports = {
    userRegisterValidation,
    userLoginValidation,
}