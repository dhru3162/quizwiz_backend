const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Session = require("../models/session");

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
        const user = await User.findById(decodedToken._id);
        if (!user) {
            return res.status(401).json({
                massage: 'User Not Found'
            })
        };

        // Check Session Expired Or Not
        const session = await Session.findOne({
            userId: user._id
        });
        if (!session) {
            return res.status(401).json({
                massage: 'jwt expired'
            })
        }

        req.loggedInUserData = {};
        req.loggedInUserData['user'] = user;
        req.loggedInUserData['session'] = session;
        next();
    } catch (error) {
        return res.status(401).json({
            massage: 'Unauthorized User',
            error
        })
    }
};

module.exports = {
    authenticate,
};