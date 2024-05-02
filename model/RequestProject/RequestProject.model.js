// RequestProject.model.js

const { required } = require('joi');
const mongoose = require('mongoose');

const RequestProjectSchema = new mongoose.Schema({
    project_id: { type : String, required : false, default : ""},
    type: { type : String, required : true },
    sub_type: { type : String, required : true },//dropdown
    detail: { type : String, required : false, default : ""},//รายละเอียด
    start_date: { type : Date, required : false, default : null},//วันที่เริ่ม
    due_date: { type : Date, required : true },//เวลาสิ้นสุด
    refs: [{
        refs: { type : String, required : false },//การอ้างอิงเอกสาร
        default : null
    }],
    remark : { type: String, required : false, default : ""},//หมายเหตุ
    customer : [{
        customer_id : { type : String, required : false },
        customer_name : { type : String, required : false },
    }],
    employee : [{
        employee_id : { type: String, required: false }
    }],
    status: { 
        type : String,
        required : false,
        enum: ['งานใหม่', 'อยู่ระหว่างการทำงาน', 'โปรเจ็คสำเร็จ', 'โปรเจ็คถูกระงับ'],
        default: 'งานใหม่'
    },//สถานะของงาน
    progress: [{
        progress_number : { type : String, required : false, default : 0},
        progress_employee_id : { type : String, required : false, default : ""},
        time : {type : Date, required : false, default : null}
    }],
   
},{ timestamps : true}, { versionKey: false });

module.exports = mongoose.model('RequestProject', RequestProjectSchema);
