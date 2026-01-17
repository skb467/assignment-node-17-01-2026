const { required } = require('joi');
const mongoose = require('mongoose');
const CourseModel = require('./course');
const UserModel = require('./user');
const { Schema } = mongoose;


const BatchSchema = new Schema({
    courseId:{
        type:Schema.Types.ObjectId,
        ref: CourseModel
    },
    batchName:{
        type:String,
        required:true
    },
    batchStart:{
        type:String,
        required:true,
    },
    batchEnd: {
        type: String,
        required: true
    },
    assignTeacher: {
        type:Schema.Types.ObjectId,
        ref: UserModel
    }
},{
    timestamps:true,
    versionKey: false
});

const BatchModel = mongoose.model('batch', BatchSchema);

module.exports = BatchModel;