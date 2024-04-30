const { request } = require('express');
const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    document_id : {type: String, required: false}, // รันอัตโนมัติ
    doc_date: {type: Date, required:false, default : Date.now},
    headers : {type: String, required: false, default : ""},//เรื่อง
    type : {type : String, required: false},
    to : {type: String, required: false, default : ""},

    ot : {
        timein : {type : Date, required : false},
        timeout : {type : Date, required : false},
        total_ot : {
            totaltime : { type : String, required : false},//รวมเป็น HH : MM : SS
            totalseconds : { type : Number, required : false} //รวมเป็นวินาที
        } // รวมชั่วโมงการทำ OT
    },
    remark : { type : String, required : false, default : "" },
    detail : { type : String, required: false, default:""},
    file : [{
        file_doc :  {type : String, required : false }
    }],

    document_true : {type : Boolean, request : false},
    status_document : {type : String , required : false , default : "รอหัวหน้าแผนกอนุมัติ"},// 1 = รอหัวหน้า  /  2 = รอผู้จัดการ  /  3 = รอกรรมการ  /  4 = อนุมัติแล้ว / 5 = ไม่อนุมัติ / 6 = รอตรวจสอบ
    // หัวหน้าเห็นได้แค่ 1  ผู้จัดการเห็นได้แค่ 2  กรรมการเห็นทั้งหมด 
    status_detail : [{
        employee_id : {type : String, required : false, default : ""},
        role : {type : String, required : false, default : ""},
        position : {type : String, required : false, default : ""},
        date : {type : Date, required : false, default : null},
        status : {type : String, required : false, default : ""},
        remark : {type : String, required : false, default : ""}
    }],


}, { versionKey: false });

module.exports = mongoose.model('Document', DocumentSchema);