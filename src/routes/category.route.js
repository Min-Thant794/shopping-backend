const express = require("express");
const router = express.Router();
const { getallCategory, createCategory, updateCategory, deleteCategory, deleteCategoryByName, updateCategoryByName } = require("../controllers/category.controller")
const { verifyToken } = require("../helper/authJWT")

router.get("/", getallCategory)
router.post("/", verifyToken, createCategory)
router.put("/id/:id", updateCategory)
router.put("/name/:name", updateCategoryByName)
router.delete("/id/:id", deleteCategory)
router.delete("/name/:name", deleteCategoryByName)

module.exports = router