const mongoose = require("mongoose");

const categoryModelSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    imageUrl: {
        type: String,
        requried: false
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId
    }
},{
    timestamps:true
})

module.exports = mongoose.model("category", categoryModelSchema)