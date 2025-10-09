const express = require("express");
const router = express.Router();
const { getAllUnit, createUnit, updateUnit, deleteUnit } = require("../controllers/unit.controller")
const {verifyToken} = require("../helper/authJWT")

router.get("/", verifyToken, getAllUnit)
router.post("/", createUnit)
router.put("/:id", updateUnit)
router.delete("/:id", deleteUnit)

module.exports = router