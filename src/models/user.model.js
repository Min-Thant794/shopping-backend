const mongoose = require('mongoose');

const userModelSchema =  new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: false, default: "", unique: true},
    phoneNumber:{
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        validate: (
            function(v){
                return /^\+?[0-9]{7,15}$/.test(v);
            }
        )
    },
    password:{type: String, required: true}
},{
    timestamps: true
})

module.exports = mongoose.model('user', userModelSchema);