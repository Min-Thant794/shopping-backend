const Role = require("../models/role.model")

const createRole = async (req, res) => {
    try {
        if (!req.body.name || req.body.name.trim() === ""){
            return res.status(400).json({
                message: "Role name is required!",
                success: false
            })
        }
        const createdRole = await Role.create({name: req.body.name})
        res.status(200).json({ 'message' : "Role created successfully!", data: createdRole, success: true})
    } catch (error) {
        console.log("An Error Occurred During Creating Role!", error)
        if(error.name === "ValidationError"){
            return res.status(400).json({
                message: "Validation failed",
                success: false
            })
        }
        res.status(500).json({message: "Internal Server Error!", success: false})
    }
}

const getAllRole = async (req, res) => {
    try {
        const fetchRole = await Role.find({})
        res.status(200).json({ 'message' : 'Role fetched successfully!', data: fetchRole, success: true})
    } catch (error) {
        console.log("An Error Occurred During Fecthing Role!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateRole = async (req, res) => {
    try {
        const id = req.params.id;
        if(!req.body.name || req.body.name.trim() === ""){
            return res.status(400).json({
                message: "Role name is required!",
                success: false
            })
        }
        const updatedRole = await Role.findByIdAndUpdate(id, {name: req.body.name.trim()}, {new: true, runValidators: true});
        res.status(200).json({"message": "Role updated successfully!", data: updatedRole, success: true});
    } catch (error) {
        console.log("An Error Occurred During Updating Role", error)
        res.status(500).json({ message: "Internal Server Error!"})
    }
}

module.exports = {
    createRole,
    getAllRole,
    updateRole
}