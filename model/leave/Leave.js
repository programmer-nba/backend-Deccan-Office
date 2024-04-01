const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    Leave_id : {type: String, required: false}, // รันอัตโนมัติ
    Employees_id: { type: String, required: false },
    Year: {type: Number, required: false},
    Leave_date : {type: Date, required: false, default: Date.now},
    Leave_type : {type: String, required: false},
    Leave_head : {type: String, required: false},
    Employees_name : {type: String, required: false},
    Employees_position : {type: String, required: false},
    Department : {type: String, required: false},

    Sick : {type : Boolean, required: false, default : false}, // ลาป่วย
    Business : {type : Boolean, required: false, default : false}, // ลากิจ
    Maternity : {type: Boolean, required: false, default : false}, // ลาคลอด

    Details : {type: String, required: false},

    Day_Start_leave : {type: Number, required: false}, //วันที่เริ่มลา
    Month_Start_leave : {type: String, required: false},
    Year_Start_leave : {type: Number, required: false},

    Day_End_leave : {type: Number, required: false}, //ลาถึงวันที่
    Month_End_leave : {type: String, required: false},
    Year_End_leave : {type: Number, required: false},

    Set_Day : {type: Number, required: false}, //จำนวนวันที่ลา

    Last_Sick : {type: Boolean, required: false, default : false}, //ประเภทการลาครั้งสุดท้าย
    Last_Business : {type : Boolean, required: false, default : false},
    Last_Maternity : {type: Boolean, required: false, default : false},

    Last_Start_Day_Leave : {type: Number, required: false}, //วันที่เริ่มลาครั้งล่าสุด
    Last_Start_Month_Leave : {type: String, required: false},
    Last_Start_Year_Leave : {type: Number, required: false},

    Last_End_Day_Leave : {type: Number, required: false}, //วันที่ลาลิ้นสุดครั้งล่าสุด
    Last_End_Month_Leave : {type: String, required: false},
    Last_End_Year_Leave : {type: Number, required: false},

    Last_Set_Day : {type: Number, required: false}, // จำนวนการลาครั้งสุดท้าย

    Contact : {type: String, required: false},
    Tel : {type: String, required: false},

    Name_again : {type: String, required: false}, //ลงชื่อ

    Commander : {type: String, require : false},
    Commander_Date : {type : String, required: false},
    Inspector : {type: String, required: false}, //ผู้ตรวจสอบ
    Inspector_Date : {type : String, required: false},

    Allow : {type: Boolean, required: false, default : false}, // การอนุญาติ
    Not_Allowed : {type: Boolean, required: false, default : false},

    Approver : {type: String, required: false}, //ผู้อนุมัติ
    Approver_Date : {type: String, require: false}

}, { versionKey: false });

module.exports = mongoose.model('Leave', LeaveSchema);