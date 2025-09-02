const userModel = require('../models/user.model');
const { encryption, comparison } = require("../helper/encryptDecrypt")
const { createToken } = require("../helper/common.helper")

const registerUser = async (req, res) => {
    try {
        console.log("req.body", req.body)

        const response = await userModel.create({
            ...req.body,
            password : encryption(req.body.password)
        })

        if(!response) res.status(400).json({message: "Failed to create user"})
            res.status(200).json({
            data: response,
            message: `User ${response.name} has successfully created!`,
            success: true,
            token: createToken({
                name: response.name,
                email: response.email,
                phoneNumber: response.phoneNumber,
                password: response.password
            })})

    } catch (error) {
        console.log(error)
        res.status(500).json("internal server error!")
    }
}

// const batchRegisterUser = async (req, res) => {
//     try {
//         const users = req.body.map( user => ({
//             ...user,
//             password: encryption(req.body.password)
//         }))
//         const response = await userModel.insertMany( users );
//         res.status(200).json({message: "Batch Users SUccessfully Created!", response})
//     } catch (error) {
//         console.log("An Error Occurred!", error)
//         res.status(500).json({message: "Internal Server Error!"})
//     }
// }

const loginUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const passwordFromReq = req.body.password;

        const foundUser = await userModel.findOne({ name: name, email: email})
        if(!foundUser) {
            return res.status(400).json({message: "User not exist!"})
        }

        if(!comparison(passwordFromReq, foundUser.password)){
            console.log("Not Authenticated!")
            return res.status(403).json({message: "User not authenticated!"})
        }

        //const updatedUser = await userModel.findOneAndUpdate({ name: name }, { isLoggedIn: true }, { new: true })

        return res.status(200).json({
            data: foundUser,
            token: createToken({ name: foundUser.name, email: foundUser.email, password: foundUser.password, role: foundUser.role}),
            message: "Login Success!",
            success: true
        })
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const updatedUser = await userModel.findByIdAndUpdate(id, req.body, {new: true})
        if (!updatedUser) res.status(400).json("Failed to update user")
        res.status(200).json(updatedUser, {message: "Successfully updated!"})
        console.log("updatedUser", updatedUser)

    } catch (error) {
        console.log(error)
        res.status(500).json("internal server error!")
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await userModel.findByIdAndDelete(id);
        if(!deletedUser) res.status(400).json("Failed to delete user!")
        res.status(200).json("Successfully deleted!")

    } catch (error) {
     res.status(500).json("internal server error!")   
    }
}


module.exports = {
    registerUser,
    //batchRegisterUser,
    loginUser,
    updateUser,
    deleteUser
}