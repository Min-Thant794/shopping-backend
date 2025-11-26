const mongoose = require("mongoose")

const roleModelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    allowedPaths: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("roles", roleModelSchema)