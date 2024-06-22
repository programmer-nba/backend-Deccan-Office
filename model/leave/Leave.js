const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveSchema = new Schema({
    
    leave_id : {type: String, required: false}, // รันอัตโนมัติ
    employees_id: { type: String, required: false },

    leave_date : {type: Date, required: false, default: Date.now},
    type_name: {type : String, required: false},
    leave_type : {type : String, required: false,}, // ประเภทลา
    leave_head : {type : String, required: false},
    details : {type: String, required: false},

    date_start_leave : {type: Date, required: false, default : Date.now}, //วันที่เริ่มลา
    date_end_leave : {type: Date, required: false, default : Date.now}, //ลาถึงวันที่

    set_day : {type: Number, required: false ,default : 0}, //จำนวนวันที่ลา 
    time_leave : {type: String, required: false},

    contact : {type: String, required: false},
    tel : {type: String, required: false},
    picture: {type: String, default:"", required: false},
    number_role: {type: Number, required: false ,default : 0},
    status_document : {type: String, defalut:"รออนุมัติ", required: false},
    status_detail : [{
        employee_id : { type : String, required : false, default : "" },
        role : { type : String, required : false, default : "" },
        position : { type : String, required : false, default : "" },
        date : { type : Date, required : false, default : Date.now },
        status : { type : String, required : false, default : "" },
        remark : { type : String, required : false, default : "" }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);