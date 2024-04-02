const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    Document_id : {type: String, required: false}, // รันอัตโนมัติ
    Year: {type: Number, required: false},
    Doc_Date: {type: Date, required:false, default : Date.now},
    Headers : {type: String, required: false},//เรื่อง
    To : {type: String, required: false },

    Status : {type : Number , required : false , default : 1},// 1 = รอหัวหน้า  /  2 = รอผู้จัดการ  /  3 = รอกรรมการ  /  4 = อนุมัติแล้ว
                                                              // หัวหน้าเห็นได้แค่ 1  ผู้จัดการเห็นได้แค่ 2  กรรมการเห็นทั้งหมด 

    Detail : [{
        detail : {type : String, required : false},
        price : {type : Number, required : false},
        qty : {type : Number, required : false}
    }],
    Employees : {
        name : {type : String, required : false},
        position : {type : String, require : false},
        id : {type : String, required : false}
    },
    Head_department : {
        head_name : {type : String, required : false},
        head_position : {type : String, required : false},
        head_id : {type : String, required : false}
    },
    Manager : {
        manager_name : {type : String, required : false},
        manager_position : {type : String, required : false},
        manager_id : {type : String, required : false}
    },
    CEO : {
        ceo_name : {type : String, required : false},
        ceo_position : {type : String, required : false},
        ceo_id : {type : String, required : false}
    }

}, { versionKey: false });

module.exports = mongoose.model('Document', DocumentSchema);