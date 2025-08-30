const mongoose = require("mongoose")

const sizeMappingSchema = new mongoose.Schema({
    EU: {
        type: String,
        required: true
    },
    UK: {
        type: String,
        required: true
    },
    USMen: {
        type: String,
        required: true
    },
    USWomen: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model("sizeMapping", sizeMappingSchema)