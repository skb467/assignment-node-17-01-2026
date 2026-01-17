const { required } = require('joi');
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required:true
    },
    courseInfo:{
        type:String,
        required:true,
    },
    courseDuration: {
        type: String,
        required: true
    },
    courseFees: {
        type: String,
        required: true
    }
},{
    timestamps:true,
    versionKey: false
});

const CourseModel = mongoose.model('course', CourseSchema);

module.exports = CourseModel;