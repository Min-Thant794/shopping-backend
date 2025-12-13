const express = require("express");
const router = express.Router();

const {
    getAllOrders,
    getUserOrders,
    updateOrderStatus,
    getOrderByShopId,
    getAllOrdersSuperAdmin,
} = require("../controllers/order.controller");

const { verifyToken } = require("../helper/authJWT");
const { allowedRole } = require("../helper/common.helper");

router.get("/order-by-id", verifyToken, getOrderByShopId);

//Admin: Get All Orders
router.get("/", verifyToken, getAllOrders);
router.get("/super-admin", verifyToken, getAllOrdersSuperAdmin);

//User: Get own orders
router.get("/user/:userId", verifyToken, getUserOrders);

//Admin or user: Update status (e.g. cancel / confirm)
router.patch("/status", verifyToken, updateOrderStatus);

module.exports = router;