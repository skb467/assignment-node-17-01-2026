const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
 
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    isAdmin: {
        type:String,
        default: false
    },
    role:{
        type:String,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true,
    versionKey: false
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;