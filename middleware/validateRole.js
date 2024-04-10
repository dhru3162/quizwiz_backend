

const validateRole = (req, res, next) => {
    const { loggedInUserData: { user: { role } } } = req

    if (role === "admin") {
        next()
    } else {
        return res.status(403).json({
            massage: "Permission denied you are not a admin"
        })
    }

}

module.exports = {
    validateRole
}