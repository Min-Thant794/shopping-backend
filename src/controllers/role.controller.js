const Role = require("../models/role.model")

const createRole = async (req, res) => {
    try {
        const payload = {
            name: req.body.name,
            description: req.body.description,
            allowedPaths: req.body.allowedPaths
        }
        const createdRole = await Role.create(payload)
        res.status(200).json({ 'message' : "Role created successfully!", data: createdRole, success: true})
    } catch (error) {
        console.log("An Error Occurred During Creating Role!", error)
        res.status(500).json({message: "Internal Server Error!"})
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
        const updatedRole = await Role.findByIdAndUpdate(id, req.body);
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