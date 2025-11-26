const categoryModel = require("../models/category.model")
const { setCache, getCache, clearCache } = require("../config/redisClient")
const config = require("../config/config")

const getallCategory = async (req, res) => {
    try {
        const cachedData = await getCache(config.REDIS_CATEGORY_KEY)
        if(cachedData){
            const jsonData = JSON.parse(cachedData)
            res.status(200).json({
                success: true,
                message: "Data Fetched From Redis Cache",
                data: jsonData
            })
        }
        const allCategory = await categoryModel.find({})
        await setCache(config.REDIS_CATEGORY_KEY, allCategory)
        const totalCategory = allCategory.length
        res.status(200).json({message: `Total ${totalCategory} ${totalCategory > 1 ? 'categories' : 'category'} found!`, allCategory})
    } catch (error) {
        console.log("An Error Occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const createCategory = async (req, res) => {
    try {
        const createCategory = await categoryModel.create({name: req.body.name.toUpperCase()})
        if(!createCategory) res.status(405).json({message: "Failed to create category", success: false})
            await clearCache(config.REDIS_CATEGORY_KEY)
            res.status(201).json({data: createCategory, message: "Successfully category created!", success: true})
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, {name: req.body.name.toUpperCase()}, {new: true})
        if(!updatedCategory) res.status(400).json({message: "Failed to update category!"})
            
            await clearCache(config.REDIS_CATEGORY_KEY)
            res.status(200).json({message: "Category is successfully updated!", updatedCategory, success: true})
        console.log("Updated Category: ", updatedCategory)
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const updateCategoryByName = async (req, res) => {
    try {
        const updatedCatByName = await categoryModel.findOneAndUpdate({name: req.params.name}, {name: req.body.name.toUpperCase()}, {new: true})
        if(!updatedCatByName) res.status(400).json({message: "Failed to update category!"})
            res.status(200).json({message: "Category is successfully updated!", updatedCatByName})
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id, {new: true})
        if(!deletedCategory) res.status(400).json({message: "Failed to delete category!"})
            res.status(200).json({message: "This category is successfully deleted!", deletedCategory})
        console.log("Deleted category: ", deletedCategory)
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

const deleteCategoryByName = async (req, res) => {
    try {
        const deleteCatByName = await categoryModel.findOneAndDelete({name: req.params.name}, {new: true})
        if(!deleteCatByName) res.status(400).json({message: "Failed to delete category!"})
            res.status(200).json({message:"This category is successfully deleted!", deleteCatByName})
        console.log("Deleted Category By Name: ", deleteCatByName)
    } catch (error) {
        console.log("An error occurred!", error)
        res.status(500).json({message: "Internal Server Error!"})
    }
}

module.exports = {
    getallCategory,
    createCategory,
    updateCategory,
    updateCategoryByName,
    deleteCategory,
    deleteCategoryByName
}