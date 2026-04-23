const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenFromCustomHeader = req.headers["x-access-token"];

        let token = null;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        } else if (tokenFromCustomHeader) {
            token = tokenFromCustomHeader;
        }

        if (!token) {
            return res.status(401).json({
                message: "No Token Provided!"
            });
        }

        const decoded = jwt.verify(token, config.SECRET_KEY);

        req.name = decoded.name;
        req.role = decoded.role;
        req.userId = decoded.userId;

        next();
    } catch (error) {
        return res.status(403).json({
            message: "User not authenticated!",
            error: error.message
        });
    }
};

module.exports = {
    verifyToken
};