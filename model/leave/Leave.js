const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    
    leave_id : {type: String, required: false}, // รันอัตโนมัติ
    employees_id: { type: String, required: false },

    leave_date : {type: Date, required: false, default: Date.now},
    leave_head : {type: String, required: false},   

    leave_Type : {type : String, required: false,}, // ประเภทลา
    details : {type: String, required: false},

    date_start_leave : {type: Date, required: false, default : Date.now}, //วันที่เริ่มลา
    date_end_leave : {type: Date, required: false, default : Date.now}, //ลาถึงวันที่

    set_day : {type: Number, required: false ,default : 0}, //จำนวนวันที่ลา 

    contact : {type: String, required: false},
    tel : {type: String, required: false},

    status : {
        status_name : { type : String, require: false ,default : "Waiting"},  //Allow , Waiting , Not_Allow

        commander : {type: String, require : false, default : ""}, //หัวหน้า
        commander_Date : {type : String, required: false, default : ""},

        inspector : {type: String, required: false, default : ""}, //ผู้ตรวจสอบ
        inspector_Date : {type : String, required: false, default : ""},

        approver : {type: String, required: false, default : ""}, //ผู้อนุมัติ
        approver_date : {type: String, require: false, default : ""}
    },

}, { versionKey: false });

module.exports = mongoose.model('Leave', LeaveSchema);