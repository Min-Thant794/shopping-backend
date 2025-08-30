const mongoose = require("mongoose");

const productModelSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String, 
        required: true
    },
    category:{
        type: String,
        enum: ["Men's Accessories", "Women's Accessories", "Men's Fashion", "Women's Fashion"]
    },
    size:{
        type: [Object],
        required: true
    },
    variants:{
        type: [Object],
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    unit:{
        type: String,
        required: true
    },
    discount:{
        type: Number,
        enum: [0, 15, 20, 30, 40],
        required: true,
        default: 0
    },
    stock:{
        type: Number,
        required: true
    },
    rating:{
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],
        default: 0,
        required: true
    },
    review:{
        type: String,
        required: false
    }
},{
    timestamps: true
})

productModelSchema.pre("save", function (next) {
    if (this.name) {
        this.name = this.name.toUpperCase();
    }
    next();
})

module.exports = mongoose.model("products", productModelSchema)