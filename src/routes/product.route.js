const express = require("express");
const router = express.Router();
const { getAllProduct, createProduct, updateProduct, updateProductByName, deleteProduct, deleteProductByName, getProductByCategory, getProductByDiscount, batchCreateProduct, getAllProductByDiscount } = require("../controllers/product.controller")

router.get("/", getAllProduct)
router.get("/category/:category", getProductByCategory)
router.get("/discount/:discount", getProductByDiscount)
router.get("/alldiscount", getAllProductByDiscount)
router.post("/", createProduct)
router.post("/batch", batchCreateProduct)
router.put("/id/:id", updateProduct)
router.put("/name/:name", updateProductByName)
router.delete("/id/:id", deleteProduct)
router.delete("/name/:name", deleteProductByName)

module.exports = router