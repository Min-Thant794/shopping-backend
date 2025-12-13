const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    shopId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    }
},{
    timestamps: true
})

module.exports = mongoose.model("unit", unitSchema)