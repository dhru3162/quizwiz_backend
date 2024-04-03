const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authenticate = async (req, res, next) => {

    if (!req.headers['authorization']) {
        return res.status(401).json({
            massage: 'Unauthorized User'
        })
    }

    try {
        const token = req.headers["authorization"].replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(401).json({
                massage: 'User Not Found'
            })
        }
        user.password = undefined
        
        req.loggedInUserData = {};
        req.loggedInUserData['user'] = { user, accessToken: token };
        next();
    } catch (error) {
        return res.status(401).json({
            massage: 'Bad Request',
            error
        })
    }
};

module.exports = {
    authenticate,
};