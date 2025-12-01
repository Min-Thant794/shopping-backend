const mongoose = require("mongoose")

const roleModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ["Super Admin", "Admin", "Salesman", "Customer"]
    },
    description: {
        type: String,
        required: false,
    },
    allowedPaths: {
        type: [String],
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("roles", roleModelSchema)