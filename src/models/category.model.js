const mongoose = require("mongoose");

const categoryModelSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
},{
    timestamps:true
})

module.exports = mongoose.model("category", categoryModelSchema)