const express = require("express")
const router = express.Router();
const {verifyToken} = require("../helper/authJWT")
const { getAllRole, createRole, updateRole } = require("../controllers/role.controller");
const { allowedRole } = require("../helper/common.helper");

router.get("/", verifyToken, getAllRole)
router.post("/", verifyToken, createRole)
router.put("/:id", verifyToken, updateRole)

module.exports = router