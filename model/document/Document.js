const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    Document_id : {type: String, required: false}, // รันอัตโนมัติ
    Doc_Date: {type: Date, required:false, default : Date.now},
    Headers : {type: String, required: false, default : ""},//เรื่อง
    Type : {type : String, required: false},
    To : {type: String, required: false, default : ""},

    OT : {
        Timein : {type : Date, required : false},
        Timeout : {type : Date, required : false},
        Total_OT : {
            totaltime : { type : String, required : false},//รวมเป็น HH : MM : SS
            totalseconds : { type : Number, required : false} //รวมเป็นวินาที
        } // รวมชั่วโมงการทำ OT
    },
    remark : { type : String, required : false, default : "" },
    Detail :{type:String, required:false, default:""},

    // Detail : [{
    //     detail : {type : String, required : false, default : ""},
    //     price : {type : Number, required : false, default : 0},
    //     qty : {type : Number, required : false, default : 0}
    // }],

    Status_document : {type : String , required : false , default : "รอหัวหน้าแผนกอนุมัติ"},// 1 = รอหัวหน้า  /  2 = รอผู้จัดการ  /  3 = รอกรรมการ  /  4 = อนุมัติแล้ว / 5 = ไม่อนุมัติ / 6 = รอตรวจสอบ
    // หัวหน้าเห็นได้แค่ 1  ผู้จัดการเห็นได้แค่ 2  กรรมการเห็นทั้งหมด 
    Status_detail : [{
        employee_id:{type : String, required : false, default : ""},
        role:{type : String, required : false, default : ""},
        position:{type : String, required : false, default : ""},
        date: {type : Date, required : false, default : null},
        status:{type : String, required : false, default : ""},
        remark:{type : String, required : false, default : ""}
    }],


}, { versionKey: false });

module.exports = mongoose.model('Document', DocumentSchema);