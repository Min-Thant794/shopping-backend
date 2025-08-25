const userModel = require('../models/user.model');
const UserModel = require('../models/user.model');

const registerUser = async (req, res) => {
    try {
        console.log("req.body", req.body)
        const response = await UserModel.create(req.body)
        
        res.status(200).json(response)

    } catch (error) {
        res.status(500).json("internal server error!")
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

        if(foundUser.isLoggedIn) return res.status(400).json("This user is logged elsewhere!")


        const updatedUser = await userModel.findOneAndUpdate({name: name}, {isLoggedIn: true}, {new: true})    
        return res.status(200).json({
            data: updatedUser,
            message: "User login success!"
        })

    } catch (error) {
        console.log("an error occurred!", error)
        res.status(500).json("internal server error!")
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
    loginUser,
    updateUser,
    deleteUser
}