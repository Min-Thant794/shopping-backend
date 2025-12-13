const express = require("express");
const router = express.Router();
const { getAllUnit, createUnit, updateUnit, deleteUnit, getUnitByShopId } = require("../controllers/unit.controller")
const {verifyToken} = require("../helper/authJWT")

router.get("/", verifyToken, getAllUnit);
router.get("/units-by-id", verifyToken, getUnitByShopId);
router.post("/", verifyToken, createUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

module.exports = router