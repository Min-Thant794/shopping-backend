const jwt = require("jsonwebtoken");
const config = require("../config/config");

const createToken = (payload, rememberMe = false) => {
    return jwt.sign(payload, config.SECRET_KEY, {
        expiresIn: rememberMe ? "7d" : (config.JWT_TTL || "1d")
    });
};

const allowedRole = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.role?.name || req.role)) {
                return res.status(403).json({
                    message: "You do not have permission for this action!",
                    success: false
                });
            }
            next();
        } catch (error) {
            return res.status(403).json({
                message: "You do not have permission for this action!",
                success: false
            });
        }
    };
};

module.exports = {
    createToken,
    allowedRole
};