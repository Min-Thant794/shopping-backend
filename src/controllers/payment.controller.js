const Payment = require("../models/payment.model");

const createPayment = async (req, res) => {
    try {
        const { name, number } = req.body;
        if (!name || !number) {
            return res.status(400).json({ message: "Name and Number are required for payment!", success: false});
        }

        //Prevent duplicate payment numbers
        const exists = await Payment.findOne({ number });
        if (exists) {
            return res.status(400).json({ message: "Payment number already exists", success: false});
        }

        const payment = await Payment.create({ name, number, shopId: req.id});

        return res.status(201).json({ message: "Payment added successfully!", data: payment, success: true });
    } catch (error) {
        console.log("An Error Occurred During createPayment()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }   
}

const getPaymentsByShopId = async (req, res) => {
    try {
        const { id } = req.params;
        const payments = await Payment.find({ shopId: id });

        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.log("An Error Occurred During getPaymentsByShopId");
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const getAllPayment = async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.log("An Error Occurred During getAllPayment()", error);
        return res.status(500).json({ message: "Internal Server Error!", success: false });
    }
}

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if(!payment) {
            return res.status(400).json({ message: "Payment not found!", success: false });
        } else {
            return res.status(200).json({ success: true, data: payment, message: "Payment found!"});
        }
    } catch (error) {
        console.log("An Error Occurred During getPaymentById", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const updatePayment = async (req, res) => {
    try {
        const { name, number } = req.body;
        const payment = await Payment.findByIdAndUpdate(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found!", success: false });
        }

        // Prevent number duplicaiton
        if (number) {
            const exists = await Payment.findOne({ number, _id: { $ne: req.params.id }});
            if (exists) {
                return res.status(400).json({ message: "Payment number already exists!", success: false});
            }
        }

        payment.name = name ?? payment.name;
        payment.number = number ?? payment.number;
        await payment.save();

        return res.status(200).json({ message: "Payment updated successfully!", data: payment, success: true});
    } catch (error) {
        console.log("An Error Occurred During updatePayment()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);
        if(!payment) {
            return res.status(404).json({ message: "Payment not found!", success: false });
        } else {
            return res.status(200).json({ message: "Payment deleted successfully!", success: true });
        }
    } catch (error) {
        console.log("An Error Occurred During deletePayment()", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

module.exports = {
    createPayment,
    getAllPayment,
    getPaymentById,
    updatePayment,
    deletePayment,
    getPaymentsByShopId
}