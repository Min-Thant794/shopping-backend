const express = require("express");
const router = express.Router();
const { getAllCategories, createCategory, updateCategory, deleteCategory, deleteCategoryByName, updateCategoryByName, getCategoryByShopId } = require("../controllers/category.controller");
const { verifyToken } = require("../helper/authJWT");

router.post("/", verifyToken, createCategory);
router.get("/", verifyToken, getAllCategories);
router.put("/id/:id", updateCategory);
router.put("/categories-by-id", verifyToken, getCategoryByShopId);
router.put("/name/:name", updateCategoryByName);
router.delete("/id/:id", deleteCategory);
router.delete("/name/:name", deleteCategoryByName);

module.exports = router