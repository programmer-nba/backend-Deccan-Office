const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    Leave_id : {type: String, required: false}, // รันอัตโนมัติ
    Employees_id: { type: String, required: false },

    Leave_date : {type: Date, required: false, default: Date.now},
    Leave_head : {type: String, required: false},   

    Leave_Type : {type : String, required: false,}, // ประเภทลา
    Details : {type: String, required: false},

    Date_Start_leave : {type: Date, required: false, default : Date.now}, //วันที่เริ่มลา
    Date_End_leave : {type: Date, required: false, default : Date.now}, //ลาถึงวันที่

    Set_Day : {type: Number, required: false ,default : 0}, //จำนวนวันที่ลา 

    Contact : {type: String, required: false},
    Tel : {type: String, required: false},

    Status : {
        Status_name : { type : String, require: false ,default : "Waiting"},  //Allow , Waiting , Not_Allow

        Commander : {type: String, require : false, default : ""}, //หัวหน้า
        Commander_Date : {type : String, required: false, default : ""},

        Inspector : {type: String, required: false, default : ""}, //ผู้ตรวจสอบ
        Inspector_Date : {type : String, required: false, default : ""},

        Approver : {type: String, required: false, default : ""}, //ผู้อนุมัติ
        Approver_Date : {type: String, require: false, default : ""}
    },

}, { versionKey: false });

module.exports = mongoose.model('Leave', LeaveSchema);