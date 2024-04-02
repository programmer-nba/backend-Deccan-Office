const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    Leave_id : {type: String, required: false}, // รันอัตโนมัติ
    Employees_id: { type: String, required: false },
    Year: {type: Number, required: false},

    Leave_date : {type: Date, required: false, default: Date.now},
    Head_Leave_type : {type: String, required: false},
    Leave_head : {type: String, required: false},

    Employees_name : {type: String, required: false},
    Employees_position : {type: String, required: false},
    Department : {type: String, required: false},

    Leave_Type : {type : String, required: false,}, // ประเภทลา
    Details : {type: String, required: false},

    Date_Start_leave : {type: Date, required: false, default : Date.now}, //วันที่เริ่มลา
    Date_End_leave : {type: Date, required: false, default : Date.now}, //ลาถึงวันที่

    Set_Day : {type: Number, required: false ,default : 0}, //จำนวนวันที่ลา

    Last_Leave_Type : {type : String, required: false},

    Last_Start_Date_Leave : {type: Date, required: false}, //วันที่เริ่มลาครั้งล่าสุด
    Last_End_Date_Leave : {type: Date, required: false}, //วันที่ลาลิ้นสุดครั้งล่าสุด

    Last_Set_Day : {type: Number, required: false, default : 0}, //จำนวนการลาครั้งสุดท้าย

    Contact : {type: String, required: false},
    Tel : {type: String, required: false},

    Name_again : {type: String, required: false}, //ลงชื่อ

    Commander : {type: String, require : false},
    Commander_Date : {type : String, required: false},
    Inspector : {type: String, required: false}, //ผู้ตรวจสอบ
    Inspector_Date : {type : String, required: false},

    Status : { type : String, require: true ,default : "Waiting"},  //Allow , Waiting , Not_Allow

    Approver : {type: String, required: false}, //ผู้อนุมัติ
    Approver_Date : {type: String, require: false}

}, { versionKey: false });

module.exports = mongoose.model('Leave', LeaveSchema);