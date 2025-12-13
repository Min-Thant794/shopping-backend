const express = require("express");
const router = express.Router();
const { createPayment, getAllPayment, getPaymentById, updatePayment, deletePayment, getPaymentsByShopId } = require("../controllers/payment.controller");
const { verifyToken } = require("../helper/authJWT");

//CRUD
router.get("/payments-by-id/:id", verifyToken, getPaymentsByShopId);
router.post("/", verifyToken, createPayment);
router.get("/", getAllPayment);
router.get("/:id", getPaymentById);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;