const express = require("express");
const router = express.Router();
const { verifyToken } = require("../helper/authJWT");
const { createSize } = require("../controllers/size.controller");

router.post("/", createSize);

module.exports = router