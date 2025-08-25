const express = require('express')
const router = express.Router()
const {registerUser, loginUser} = require("../controllers/user.controller")


router.post("/createUser", registerUser)
router.post("/login", loginUser)

module.exports = router