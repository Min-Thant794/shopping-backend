const sizeMap = require("../models/sizeMapping.model")

const createSizeMap = async (req, res) => {
    try {
        const {EU, UK, USMen, USWomen} = req.body;
        const createdSizeMap = await sizeMap.create({EU, UK, USMen, USWomen})
        if(!createdSizeMap) res.status(400).json({message: "Failed to create size map"})
            res.status(200).json({message: "Successfully created size map!", createdSizeMap})
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateSizeMap = async (req, res) => {
    try {
        const {EU, UK, USMen, USWomen} = req.body;
        const updatedSizeMap = await sizeMap.findByIdAndUpdate(req.params.id, {EU, UK, USMen, USWomen}, {new: true})
        if(!updatedSizeMap) res.status(400).json({message: "Failed to update size map"})
            res.status(200).json({message: "Successfully updated size map!", updatedSizeMap})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(400).json({message: "Internal Server Error!"})
    }
}

const updateSizeMapByName = async (req, res) => {
    try {
        const {EU, UK, USMen, USWomen} = req.body;
        const updatedSizeMapByNumber = await sizeMap.findOneAndUpdate({EU: req.params.EU}, {EU, UK, USMen, USWomen}, {new:true})
        if(!updatedSizeMapByNumber) res.status(400).json({message: "Failed to update size map"})
            res.status(200).json({message: "Successfully updated size map!", updatedSizeMapByNumber})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteSizeMap = async (req, res) => {
    try {
        const deletedSizeMap = await sizeMap.findByIdAndDelete(req.params.id, {new: true})
        if (!deletedSizeMap) res.status(400).json({message: "Failed to delete size map!"})
            res.status(200).json({message: "Successfully deleted size map!"})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteSizeMapByName = async (req, res) => {
    try {
        const deletedSizeMapByName = await sizeMap.findOneAndDelete({EU: req.params.EU}, {new: true})
        if (!deletedSizeMapByName) res.status(400).json({message: "Failed to delte size map!"})
            res.status(200).json({message: "Successfully deleted size map!"})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({messsage: "Internal Server Error!"})
    }
}

module.exports = {
    createSizeMap,
    updateSizeMap,
    updateSizeMapByName,
    deleteSizeMap,
    deleteSizeMapByName
}