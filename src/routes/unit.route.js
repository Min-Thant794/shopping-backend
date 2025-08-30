const express = require("express");
const router = express.Router();
const { getAllUnit, createUnit, updateUnit, deleteUnit } = require("../controllers/unit.controller")

router.get("/", getAllUnit)
router.post("/", createUnit)
router.put("/:id", updateUnit)
router.delete("/:id", deleteUnit)

module.exports = router