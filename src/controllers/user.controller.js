const userModel = require('../models/user.model');
const UserModel = require('../models/user.model');

const registerUser = async (req, res) => {
    try {
        console.log("req.body", req.body)
        const response = await UserModel.create(req.body)
        
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json(error)
    }
}

const loginUser = async (req, res) => {
    try {
        const {name, email, phoneNumber, password} = req.body
        const foundUser = await UserModel.findOne({name: name})
        if (!foundUser){
            return res.status(404).json({message: "User not found!"})
        }
        
        if(foundUser.email !== email || foundUser.phoneNumber !== phoneNumber || foundUser.password !== password)
            return res.status(403).json({message:"User not authorized!"})

        return res.status(200).json({
            data: foundUser,
            message: "User login success!"
        })

    } catch (error) {
        console.log("an error occurred!", error)
        res.status(500).json(error)
    }
}

const updateUser = async (req, res) => {
    try {
        const {name, email, phoneNumber} = req.body;
        const foundUser = await userModel.findOne({name: name})
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = {
    registerUser,
    loginUser
}