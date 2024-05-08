const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    image: {type: String, required : false}, 
    company: {type : String, required : false, default : ""},// ดึงจากฐานข้อมูลบริษัท
    header: {type: String, required : false, default : ""},
    description: {type: String, required : false, default : "" },
    department: {type: String, required : false, default : "" },
    amount : {type: Number, required : false, default : 0},// จำนวนคนที่รับ
    age : {
        start_age : {type: Number, required: false, default : 22},// อายุที่รับเข้าทำงาน
        end_age : {type: Number, required : false, default : 50}
    },
    start_salary: {type: Number, required : false, default : 0},
    end_salary: {type: Number, required : false, default : 0},
    sex: {type: String, required : false, default : ""},
    experience : {type: String, required : false, default : ""},//ประสบการณ์
    education : {
        education_lv : {type: String, required : false, default : ""},//ระดับการศึกษา
        field_of_study : {type: String, required : false, default : ""} //สาขาวิชา
    },
    feature : [{
        feature_detail : {type: String, required : false}//คุณสมบัติ (เพิ่มได้หลายอัน)
    }],
    working : [{
       working : {type: String, required : false} //ลักษณะงาน (เพิ่มได้หลายอัน)
    }],
    welfare : [{
        welfare : {type: String, required : false}//สวัสดิการ (เพิ่มได้หลายอัน)
    }],

    views: {type: Number, required : false, default : 0},
    applicants : {type: Number, required : false, default : 0},//จำนวนผู้สมัคร
    
    update_date: { type: Date, default: Date.now },
    post_date: { type: Date, default: Date.now }, // วันที่ประกาศ
    end_date : {type: Date, required : false, default: null},//วันที่ปิดรับ
    
    post_status: {type : String, required : false, default : "เปิดรับสมัคร"} //เปิดรับสมัคร , ปิดรับสมัคร

}, { versionKey: false });

module.exports = mongoose.model('Posts', PostSchema);