const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    image: {type: String, required : false}, 
    Company: {type : String, required : false},// ดึงจากฐานข้อมูลบริษัท
    Header: {type: String, required : false},
    Description: {type: String, required : false},
    department: {type: String, required : false},
    amount : {type: Number, required : false},// จำนวนคนที่รับ
    age : {
        start_age : {type: Number, required: false, default : 22},// อายุที่รับเข้าทำงาน
        end_age : {type: Number, required : false, default : 50}
    },
    salary: {type: String, required : false},
    sex: {type: String, required : false},
    experience : {type: String, required : false},//ประสบการณ์
    Education : {
        Education_lv : {type: String, required : false},//ระดับการศึกษา
        Field_of_study : {type: String, required : false} //สาขาวิชา
    },
    feature : [{
        feature_detail : {type: String, required : false}//คุณสมบัติ (เพิ่มได้หลายอัน)
    }],
    Working : [{
       working : {type: String, required : false} //ลักษณะงาน (เพิ่มได้หลายอัน)
    }],
    Welfare : [{
        welfare : {type: String, required : false}//สวัสดิการ (เพิ่มได้หลายอัน)
    }],

    views: {type: Number, required : false, default : 0},
    applicants : {type: Number, required : false, default : 0},//จำนวนผู้สมัคร
    
    Update_date: { type: Date, default: Date.now },
    post_date: { type: Date, default: Date.now }, // วันที่ประกาศ
    end_date : {type: String, required : false, default: null},//วันที่ปิดรับ
    
    Post_status: {type : String, required : false, default : "เปิดรับสมัคร"} //เปิดรับสมัคร , ปิดรับสมัคร

}, { versionKey: false });

module.exports = mongoose.model('Posts', PostSchema);