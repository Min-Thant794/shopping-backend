const mongoose = require('mongoose');
const Role = require("./role.model");

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
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
        required: true,
    },
    isLoggedIn:{type: Boolean, required: false, default: true},
    allowedPath:{
        type: [String],
        required: false
    },
    imageUrl:{
        type: String,
        required: false
    },
    active:{
        type: Boolean,
        default: true
    },
    paymentMethods: {
        type: [Object],
        required: false,
    }
},{
    timestamps: true
});

//pre save hook
userModelSchema.pre("save", async function (next) {
    if(!this.role) {
        const userRole = await Role.findOne({ name: "Customer" });

        if(!userRole) {
            throw new Error("Default role \"Customer\" not found in roles collection.");
        }

        this.role = userRole._id;
    }

    next();
})

module.exports = mongoose.model('user', userModelSchema);