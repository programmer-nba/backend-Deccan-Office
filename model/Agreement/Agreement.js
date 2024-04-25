const { request } = require('express');
const { required } = require('joi/lib');
const mongoose = require('mongoose');

const AgreementSchema = new mongoose.Schema({

    argument_type : {type : String, required : false}, //ประเภทสัญญาข้อตกลง
    argument_detail : {type : String, required : false}, //รายละเอียดสัญญาข้อตกลง
    argument_username : {type : String, required : false}, //ชื่อ-นามสกุลผู้ใช้
    argument_idcard : {type : String, required : false}, //เลขบัตรประจำตัวประชาชน
    argument_position : {type : String, required : false}, //ตำแหน่งที่ได้รับ
    argument_salary : {type : Number, required : false}, //เงินเดือน
    argument_status : {type : String, required : false, default : "รอการยอมรับ"}, //สถาณะ  รอการยอมรับ , ไม่ยอมรับ , ยอมรับ
    argument_timeout : {type : Date, required : false}, //วันหมดอายุสัญญา
    argument_timeline : [{
        timeline_userid : {type : String, required : false}, // _id ของคนเพิ่ม
        timeline : {type : Date, required : false}, //เวลาที่กดอัพเดต
        action : {type : String, required : false} // การกระทำเช่น เพิ่มข้อมูล , อัพเดตข้อมูล
    }]
    
}, { versionKey: false });

module.exports = mongoose.model('Agreement', AgreementSchema);