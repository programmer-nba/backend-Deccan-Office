// RequestProject.model.js

const { required } = require('joi');
const mongoose = require('mongoose');

const RequestProjectSchema = new mongoose.Schema({
    project_id : { type : String, required : false },
    type : { type : String, required : true },//dropdown
    sub_type : { type : String, required : true },//dropdown
    detail : { type : String, required : false, default : ""},//รายละเอียด
    start_date : { type : Date, required : false, default : null},//วันที่เริ่ม
    due_date : { type : Date, required : false, default : null },//เวลาสิ้นสุด
    refs : [{
        refs_file : { type : String, required : false },//การอ้างอิงเอกสาร
    }],
    remark : { type: String, required : false, default : ""},//หมายเหตุ
    employee : [{
        employee_id : { type: String, required: false }
    }],
    status: { type : String, required : false, default: 'New' },//สถานะของงาน
    progress: [{
        progress_number : { type : String, required : false, default : 0},
        progress_employee_id : { type : String, required : false, default : ""},
        time : {type : Date, required : false, default : null}
    }],
    customer : {
        customer_iden : { type : String, required : false, default : "" },
        customer_name : { type : String, required : false, default : "" },
        customer_tel : { type : String, required : false, default : "" },
        customer_address : { type : String, required : false, default : "" },
        customer_line : { type : String, required : false, default : "" }
    },
    order : {
        receiptnumber : { type : String, required : false, default : ""},
        shop_id : { type : String, required : false, default : ""},
        shop_type : { type : String, required : false, default : ""},
        paymenttype : { type : String, required : false, default : ""},
        const : { type : Number, required : false, default : null},
        price : { type : Number, required : false, default : null},
        freight : { type : Number, required : false, default : null},
        moneyreceive : { type : Number, required : false, default : null},
        change : { type : Number, required : false, default : null},
        order_employee : { type : String, required : false, default : null},
    },
    product_detail : {
        type : [{
            packageid : { type : String, required : false, default : ""},
            packagename : { type : String, required : false, default : ""},
            packagedetail : { type : String, required : false, default : ""},
            quantity : { type : Number, required : false, default : null},
            price : { type : Number, required : false, default : null},
            cost : { type : Number, required : false, default : null},
            freight : { type : Number, required : false, default : null}
        }]
    }

},{ timestamps : true}, { versionKey: false });

module.exports = mongoose.model('RequestProject', RequestProjectSchema);
