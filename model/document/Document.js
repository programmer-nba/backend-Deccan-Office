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

    Detail : [{
        detail : {type : String, required : false, default : ""},
        price : {type : Number, required : false, default : 0},
        qty : {type : Number, required : false, default : 0}
    }],

    Status : {type : String , required : false , default : "รอหัวหน้าอนุมัติ"},// 1 = รอหัวหน้า  /  2 = รอผู้จัดการ  /  3 = รอกรรมการ  /  4 = อนุมัติแล้ว / 5 = ไม่อนุมัติ
    // หัวหน้าเห็นได้แค่ 1  ผู้จัดการเห็นได้แค่ 2  กรรมการเห็นทั้งหมด 
    Employee : {
        employee_id: {type : String, required : false, default : ""},
        employee_date: {type : Date, required : false, default : null}
    },

    Head_department : {
        head_id : {type : String, required : false, default : ""},
        head_date : {type : Date, required : false, default : null}
    },
    Manager : {
        manager_id : {type : String, required : false, default : ""},
        manager_date : {type : Date, required : false, default : null}
    },
    CEO : {
        ceo_id : {type : String, required : false, default : ""},
        ceo_date : {type : Date, required : false, default : null}
    }

}, { versionKey: false });

module.exports = mongoose.model('Document', DocumentSchema);