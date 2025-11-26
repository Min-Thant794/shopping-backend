const express = require('express')
const router = express.Router()
const {registerUser, loginUser, updateUser, deleteUser, batchRegisterUser, getAllAdmin} = require("../controllers/user.controller")
const upload = require("../config/multer")
const { verifyToken } = require('../helper/authJWT')

router.get("/admin", verifyToken, getAllAdmin)
router.post("/", registerUser)
// router.post("/batch", batchRegisterUser)
router.post("/login", loginUser)
router.put("/:id", upload.single("image"), updateUser)
router.delete("/:id", deleteUser)

module.exports = router