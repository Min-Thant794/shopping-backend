const express = require("express")
const { createSizeMap, updateSizeMap, updateSizeMapByName, deleteSizeMap, deleteSizeMapByName } = require("../controllers/sizeMapping.controller")
const router = express.Router()

router.post("/", createSizeMap)
router.put("/id/:id", updateSizeMap)
router.put("/number/:EU", updateSizeMapByName)
router.delete("/id/:id", deleteSizeMap)
router.delete("/number/:EU", deleteSizeMapByName)

module.exports = router