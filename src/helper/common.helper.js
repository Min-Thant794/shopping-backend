const jwt = require("jsonwebtoken")
const config = require("../config/config")

const createToken = (payload) => {
    return jwt.sign(payload, config.SECRET_KEY, {
        expiresIn: config.JWT_TTL
    })
}

const allowedRole = (...role) => {
    return (req, res, next) => {
        try {
            if(!role.includes(req.role.name)){
                return res.status(403).json({
                    message: "You do not have any permission for editing role!",
                    success: false
                });
            }
        } catch (error) {
            return res.status(403).json({
                message: "You do not have permission for editing role!(), error",
                success: false
            })
        }
    }
}

module.exports = {
    createToken,
    allowedRole
}