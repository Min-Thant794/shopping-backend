const userModel = require('../models/user.model');
const { encryption, comparison } = require("../helper/encryptDecrypt")
const { createToken } = require("../helper/common.helper");
const { uploadImage } = require('../config/supabase');
const { getCache } = require('../config/redisClient');
config = require("../config/config")

const registerUser = async (req, res) => {
    try {
        console.log("req.body", req.body)

        const foundUser = await userModel.find({name: req.body.name})
        if(foundUser && foundUser.length > 0) {
            return res.status(400).json({message: "User Already Exist!", success: false})
        }
        const response = await userModel.create({
            ...req.body,
            password : encryption(req.body.password)
        })

        const {name, password, role} = response;
        const token = createToken({name, password, role});

        res.status(200).json({
            data: response,
            token,
            message: `User ${response.name} has successfully created!`,
            success: true
        })

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

const getAllAdmin = async (req, res) => {
    try {
        const allAdmin = await userModel.find().populate("role")
        return res.status(200).json({data: allAdmin, message: "Admin user successfully fetched!", success: true})
    } catch (error) {
        console.log(error) 
        res.status(500).json({message: "Initernal server error!", error})       
    }
}

const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;
        console.log(name, password)

        if (!name || !password) {
            return res.status(400).json({ message: "Name and password are required!" });
        }

        const foundUser = await userModel.findOne({ name }).populate("role");
        if (!foundUser) {
            return res.status(400).json({ message: "User does not exist!" });
        }

        const isPasswordCorrect = await comparison(password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({ message: "User not authenticated!" });
        }

        return res.status(200).json({
            data: foundUser,
            token: createToken({ name: foundUser.name, email: foundUser.email, password: foundUser.password, role: foundUser.role }),
            message: "Login Success!",
            success: true
        });
    } catch (error) {
        console.log("An Error Occurred!", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        let finalData = {...req.body}
        if(req.file){
            const imageUrl = await uploadImage(req.file)
            finalData = {...finalData, imageUrl}
        }else{
            delete finalData.image
        }

        if(req.body.password && req.body.password.trim() !== ""){
            finalData.password = encryption(req.body.password)
        }else{
            delete finalData.password
        }

        const updatedUser = await userModel.findByIdAndUpdate(id, finalData, {new: true})
        if(!updatedUser){
            return res.status(400).json({message: "Failed to update user!", success: false})
        }
        return res.status(200).json({message: "Successfully Updated!", success: true, data: updatedUser})

    } catch (error) {
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUserRole = await userModel.findByIdAndUpdate(id, { role: req.body.role}, {new: true})
        if(!updatedUserRole) return res.status(400).json({message: "Failed to update user role!", success: false});
        res.status(200).json({success: true, message: "Successfully updated user role!", data: updatedUserRole})
    } catch (error) {
        console.log("Error occurred at updateUserRole()", error);
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedUser = await userModel.findByIdAndDelete(id);
        if(!deletedUser) res.status(400).json("Failed to delete user!")
        return res.status(200).json({message: "Successfully deleted!", success: true})

    } catch (error) {
     res.status(500).json("internal server error!")   
    }
}

module.exports = {
    getAllAdmin,
    registerUser,
    //batchRegisterUser,
    loginUser,
    updateUserRole,
    updateUser,
    deleteUser
}