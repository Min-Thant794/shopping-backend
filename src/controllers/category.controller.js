const Category = require("../models/category.model");
const { uploadImage } = require("../config/supabase");

const getAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({})
        const totalItems = allCategories.length;
        if(allCategories){
            return res.status(200).json({ message: `${totalItems} ${totalItems > 1 ? ' categories ' : ' category '} retrieved`, data: allCategories, success: true});
        } else {
            return res.status(400).json({ message: "Failed to retrieve categories!", success: false});
        }
    } catch (error) {
        console.log("Error occurred at getAllCategories()", error);
        return res.status(500).json({ message: "Internal Server Error! getallCategories()", error});
    }
}

const getCategoryByShopId = async (req, res) => {
    try {
        const categories = await Category.find({ shopId: req.id })
        if(categories){
            return res.status(200).json({ message: `Successfully fetched categories!`, data: categories, success: true});
        } else {
            return res.status(400).json({ message: "Failed to retrieve categories!", success: false});
        }
    } catch (error) {
        console.log("Error occurred at getCategoryByShopId()", error);
        return res.status(500).json({ message: "Internal Server Error! getCategoryByShopId()", error});
    }
}

const createCategory = async (req, res) => {
    try {
        let finalData = { ...req.body, shopId: req.id }

        if (req.file && req.body.image !== "null") {
            const imageUrl = await uploadImage(req.file);
            final = { ...finalData, imageUrl }
        } else {
            delete finalData.image
        }

        console.log("Final Data: ", finalData);
        const createdCategory = await Category.create(finalData);
        return res.status(200).json({ message: `Category successfully created!`, data: createdCategory, success: true});
    } catch (error) {
        console.log("Error occurred at createCategory()", error);
        return res.status(500).json({ message: "Internal Server Error! createCategory()", error});
    }   
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true});
        if (updatedCategory){
            return res.status(200).json({ message: `Category updated successfully!`, data: updatedCategory, success: true});
        } else {
            return res.status(400).json({ message: `Failed to update category!`, success: false});
        }
    } catch (error) {
        console.log("Error updating category updateCategory()", error);
        return res.status(500).json({ message: `Internal Server Error! updateCategory()`, error});
    }
}

const updateCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const updatedCategoryByName = await Category.findOneAndUpdate({ name }, req.body, { new: true});
        if (updatedCategoryByName) {
            return res.status(200).json({ message: `Category updatd successfully!`, data: updatedCategoryByName, success: true})
        } else {
            return res.status(400).json({ message: `Failed to update category!`, success: false});
        }
    } catch (error) {
        console.log("Error occurred at updateCategoryByName()", error);
        return res.status(500).json({ message: `Internal Server Error! updateCategoryByName()`, error});
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id, { new: true });
        if (deletedCategory) {
            return res.status(200).json({ message: `Category deleted successfully!`, data: deletedCategory, success: true});
        } else {
            return res.status(400).json({ message: `Failed to delete category!`, success: false});
        }
    } catch (error) {
        console.log("Error Deleting Category! deleteCategory()", error);
        return res.status(500).json({ message: "Internal Server Error! deleteCategory()", error});
    }
}

const deleteCategoryByName = async (req, res) => {
    try {
        const { name } = req.params;
        const deletedCategoryByName = await Category.findOneAndDelete({ name }, {new: true});
        if (deletedCategoryByName) {
            return res.status(200).json({ message: `Category deleted successfully!`, data: deletedCategoryByName, success: true});
        } else {
            return res.status(400).json({ message: `Failed to delete category!`, success: false});
        }
    } catch (error) {
        console.log("Erorr Deleting Category by Name! deleteCategoryByName()", error);
        return res.status(500).json({ message: `Internal Server Error! deleteCategoryByName()`, error});
    }
}

module.exports = {
    getAllCategories,
    getCategoryByShopId,
    createCategory,
    updateCategory,
    updateCategoryByName,
    deleteCategory,
    deleteCategoryByName
}