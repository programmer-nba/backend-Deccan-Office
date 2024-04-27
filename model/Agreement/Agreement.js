const { request } = require('express');
const { required } = require('joi/lib');
const mongoose = require('mongoose');

const AgreementSchema = new mongoose.Schema({

    user_id : {type : String, required : false}, //ใส่  _id ของ user นั้น
    argument_type : {type : String, required : false}, //ประเภทสัญญาข้อตกลง
    argument_detail : {type : String, required : false}, //รายละเอียดสัญญาข้อตกลง
    argument_first_name : {type : String, required : false}, //ชื่อ
    argument_last_name : {type : String, required : false}, //นามสกุล
    argument_idcard : {type : String, required : false}, //เลขบัตรประจำตัวประชาชน
    argument_position : {type : String, required : false}, //ตำแหน่งที่ได้รับ
    argument_salary : {type : Number, required : false}, //เงินเดือน
    argument_status : {type : String, required : false, default : "รอการตอบรับ"}, //สถาณะ  รอการยอมรับ , ไม่ยอมรับ , ยอมรับ
    argument_timeout : {type : Date, required : false}, //วันหมดอายุสัญญา
    argument_timeline : [{
        timeline_userid : {type : String, required : false}, // _id ของคนเพิ่ม
        timeline : {type : Date, required : false}, //เวลาที่กดอัพเดต
        action : {type : String, required : false} // การกระทำเช่น เพิ่มข้อมูล , อัพเดตข้อมูล
    }]
    
}, { versionKey: false });

module.exports = mongoose.model('Agreement', AgreementSchema);