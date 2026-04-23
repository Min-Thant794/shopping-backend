const userModel = require('../models/user.model');
const Role = require("../models/role.model")
const { encryption, comparison } = require("../helper/encryptDecrypt")
const { createToken } = require("../helper/common.helper");
const { uploadImage } = require('../config/supabase');
// const { getCache } = require('../config/redisClient');

const registerUser = async (req, res) => {
    try {
        const { name, password, role: roleName, rememberMe, ...rest } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                message: "Name and password are required!",
                success: false
            });
        }

        const foundUser = await userModel.findOne({ name });
        if (foundUser) {
            return res.status(400).json({
                message: "User Already Exist!",
                success: false
            });
        }

        let roleDoc;

        if (roleName) {
            console.log("Finding role:", roleName);

            roleDoc = await Role.findOne({
                name: roleName,
                active: true
            });

            if (!roleDoc) {
                console.log("Role not found:", roleName);
                return res.status(400).json({
                    message: `Role "${roleName}" not found`,
                    success: false
                });
            }
        } else {
            console.log("No role provided, using default Customer");

            roleDoc = await Role.findOne({
                name: "Customer",
                active: true
            });

            if (!roleDoc) {
                return res.status(500).json({
                    message: 'Default role "Customer" not found',
                    success: false
                });
            }
        }

        const newUserData = {
            ...rest,
            name,
            password: encryption(password),
            role: roleDoc._id,
            allowedPath: roleDoc.allowedPaths
        };

        const response = await userModel.create(newUserData);

        const populatedUser = await userModel
            .findById(response._id)
            .populate("role");

        const token = createToken(
            {
                userId: populatedUser._id,
                name: populatedUser.name,
                role: populatedUser.role.name
            },
            rememberMe
        );

        return res.status(201).json({
            data: populatedUser,
            token,
            message: `User ${populatedUser.name} has successfully created!`,
            success: true
        });

    } catch (error) {
        console.log("===== REGISTER USER ERROR =====");
        console.log(error);

        return res.status(500).json({
            message: "Internal server error!",
            success: false
        });
    }
};

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
        const { name, password, rememberMe } = req.body;

        if (!name || !password) {
            return res.status(400).json({
                message: "Name and password are required!"
            });
        }

        const foundUser = await userModel.findOne({ name }).populate("role");
        if (!foundUser) {
            return res.status(400).json({
                message: "User does not exist!"
            });
        }

        const isPasswordCorrect = await comparison(password, foundUser.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({
                message: "User not authenticated!"
            });
        }

        const token = createToken(
            {
                userId: foundUser._id,
                name: foundUser.name,
                role: foundUser.role.name
            },
            rememberMe
        );

        return res.status(200).json({
            data: foundUser,
            token,
            message: "Login Success!",
            success: true
        });
    } catch (error) {
        console.log("An Error Occurred!", error);
        res.status(500).json({
            message: "Internal Server Error!"
        });
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
        const { role: roleName } = req.body;

        const roleDoc = await Role.findOne({ name: roleName, active: true });

        if (!roleDoc) {
            return res.status(400).json({
                message: `Role "${roleName}" not found`,
                success: false
            });
        }

        const updatedUserRole = await userModel.findByIdAndUpdate(
            id,
            {
                role: roleDoc._id,
                allowedPath: roleDoc.allowedPaths
            },
            { new: true }
        ).populate("role");

        if (!updatedUserRole) {
            return res.status(400).json({
                message: "Failed to update user role!",
                success: false
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully updated user role!",
            data: updatedUserRole
        });
    } catch (error) {
        console.log("Error occurred at updateUserRole()", error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
};

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