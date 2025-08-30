const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("unit", unitSchema)