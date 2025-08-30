const express = require("express");
const router = express.Router();
const { getallCategory, createCategory, updateCategory, deleteCategory, deleteCategoryByName, updateCategoryByName } = require("../controllers/category.controller")

router.get("/", getallCategory)
router.post("/", createCategory)
router.put("/id/:id", updateCategory)
router.put("/name/:name", updateCategoryByName)
router.delete("/id/:id", deleteCategory)
router.delete("/name/:name", deleteCategoryByName)

module.exports = router