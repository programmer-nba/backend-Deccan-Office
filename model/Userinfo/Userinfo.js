const { request } = require('express');
const mongoose = require('mongoose');

const UserinfoSchema = new mongoose.Schema({
    citizen_id: {type : String, request : false},
    user_password: {type : String, request : false},
    name: {type : String, request : false},
    gender: {type : String, request : false},
    birth: {type : String, request : false},
    tel: {type : String, request : false},
    status: {
        type: String,
        default: 'Pending'
    },
    role: { 
        type: String, 
        default: 'User' 
    }, 
    country: {type : String, request : false},
    religion: {type : String, request : false},
    height: {type : String, request : false},
    weight: {type : String, request : false},
    marry: {type : String, request : false},
    soldier: {type : String, request : false},
    address: {type : String, request : false},
    province: {type : String, request : false},
    postal_code: {type : String, request : false},
    line_id: {type : String, request : false},
    job_title: {type : String, request : false},
    desired_salary: {type : String, request : false},
    image: {type : String, request : false},
    exams: [{
        score: Number,
        passed: Boolean,
        exam_date: Date
    }],
    updated_at: { type: Date, default: Date.now },
    user: { // เพิ่มฟิลด์ user ที่เชื่อมโยงกับโมเดล User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // กำหนดความสัมพันธ์กับโมเดล User
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('Userinfo', UserinfoSchema);
