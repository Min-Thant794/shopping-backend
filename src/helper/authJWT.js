const jwt = require("jsonwebtoken")
const config = require("../config/config")

const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"]
    
    if(!token) res.status(401).json({message: "No Token Provided!"})

    jwt.verify(token, config.SECRET_KEY, async (err, decoded) => {
        if(err) return res.status(403).json({message: "User not authenticated!", error: err})
        console.log("Decoded", decoded)
        req.name = decoded.name,
        req.role = decoded.role

        next();
    })
}

module.exports = {
    verifyToken
}