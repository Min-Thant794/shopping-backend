const mongoose = require('mongoose');

const userModelSchema =  new mongoose.Schema({
    name:{type: String, required: true, unique: true},
    email:{type: String, required: false, unique: true, sparse: true,
        set: v => v === "" ? undefined : v
    },
    phoneNumber:{
        type: String, 
        required: false, 
        unique: true,
        sparse: true,
        set: v => v === "" ? undefined : v,
        trim: true,
        validate: (
            function(v){
                return /^\+?[0-9]{7,15}$/.test(v);
            }
        )
    },
    password:{type: String, required: true},
    role:{type: String, enum: ["Super Admin", "Admin", "Customer"], required: true, default: "Customer"},
    isLoggedIn:{type: Boolean, required: true, default: true},
    allowedPath:{
        type: [String],
        require: true
    },
    imageUrl:{
        type: String,
        required: false
    }
},{
    timestamps: true
})

module.exports = mongoose.model('user', userModelSchema);