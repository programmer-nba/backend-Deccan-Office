const { request } = require('express');
const mongoose = require('mongoose');

const UserinfoSchema = new mongoose.Schema({
    citizen_id: { type: String, request: true},
    user_password: { type: String, request: false, default : ""},
    name: { type: String, request: false, default : ""},
    lastname : {type : String,  request : false, default : ""},
    email : {type : String,  request : false, default : ""},
    gender: { type: String, request: false, default : ""},
    birth: { type: String, request: false, default : ""},
    tel: { type: String, request: false, default : ""},
    status: { type: String, default: 'รอการสัมภาษณ์', request : false },
    role: { type: String, default: 'User', request : false },
    country: { type: String, request: false, default : ""},
    religion: { type: String, request: false, default : ""},
    height: { type: String, request: false, default : "" },
    weight: { type: String, request: false, default : "" },
    marry: { type: String, request: false, default : "" },
    soldier: { type: String, request: false, default : "" },
    address: { type: String, request: false, default : "" },
    province: { type: String, request: false, default : "" },
    postal_code: { type: String, request: false, default : "" },
    line_id: { type: String, request: false, default : "" },
    job_title: { type: String, request: false, default : "" },
    desired_salary: { type: Number, request: false, default : null },
    image: { type: String, request: false, default : "" },
    exams: [{
        score: { type : Number, request : false, default : null},
        passed: { type : Boolean, request : false, default : null},
        exam_date: { type : Date, request : false, default : null}
    }],
    updated_at: { type: Date, default: Date.now, request : false},
    user: { // เพิ่มฟิลด์ user ที่เชื่อมโยงกับโมเดล User
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // กำหนดความสัมพันธ์กับโมเดล User
        required: true
    }
}, { versionKey: false });

module.exports = mongoose.model('Userinfo', UserinfoSchema);
