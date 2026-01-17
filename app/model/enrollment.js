const { required } = require('joi');
const mongoose = require('mongoose');
const CourseModel = require('./course');
const UserModel = require('./user');
const { Schema } = mongoose;


const EnrollmentSchema = new Schema({
    studentId:{
        type:Schema.Types.ObjectId,
        ref: CourseModel
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref: CourseModel
    },
    batchId:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    versionKey: false
});

const EnrollmentModel = mongoose.model('enrollment', EnrollmentSchema);

module.exports = EnrollmentModel;