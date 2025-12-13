const Order = require("../models/order.model.js");
const { getIO } = require("../utils/socket");

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ shopId: req,id })
        if (orders) {
            return res.staus(200).json({ message: "All Orders Successfully Fetched!", data: orders, success: true});
        } else {
            return res.status(400).json({ message: "Failed to Fetched Orders", success: false });
        }
    } catch (error) {
        console.log("An Error Occurred During getAllOrders()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false});       
    }
}

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("user id: ", userId);

        const orders = await Order.find({ "user.userId" : userId}).sort({ createdAt: -1 });
        if (orders) {
            return res.status(200).json({ success: true, data: orders });
        }
    } catch (error) {
        console.log("An Error Occurred During getUserOrders()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const getOrderByShopId = async (req, res) => {
    try {
        const orders = await Order.find({ "items.shopId" : req.id }).sort({ createdAt: -1 });
        if (orders) {
            return res.status(200).json({ success: true, data: orders });
        }
    } catch (error) {
        console.log("An Error Occurred During getOrderByShopId", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const getAllOrdersSuperAdmin = async (req, res) => {
    try {
        const orders = await Order.find({});
        if (orders) {
            return res.status(200).json({ success: true, data: orders });
        }
    } catch (error) {
        console.log("An Error Occurred During getAllOrdersSuperAdmin", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        console.log("order status");

        if(!orderId || !status) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: "Order not found", success: false });
        }

        //Prevent redundant updates
        if (order.status === status ) {
            return res.status(200).json({ success: true, message: "No changes made", order });
        }

        //Prevent cancelling confirmed/ completed orders (for user-side cancel)
        if (order.status !== "pending" && status === "cancelled") {
            return res.status(400).json({ message: "Only pending orders can be cancelled", success: false });
        }

        order.status =status;
        await order.save();

        //Broadcast real-time update to all connected clients
        const io = getIO();
        io.emit("order_status_update", order);

        return res.status(200).json({ message: `Order ${status === "cancelled" ? "cancelled" : "updated"} successfully!`, success: true, order});

    } catch (error) {
        console.log("An Error Occurred During updateOrderStatus()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

module.exports = {
    getOrderByShopId,
    getAllOrders,
    getAllOrdersSuperAdmin,
    updateOrderStatus,
    getUserOrders
}