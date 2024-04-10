const mongoose = require('mongoose');

const RequestProjectSchema = new mongoose.Schema({
    
    Project_id : { type : String, required : false },
    Title : { type : String, required : false },
    Type : { type : String, required : false },
    Sub_type : { type : String, required : false },
    Detail : { type : String, required : false },
    Start_date : { type : Date, required : false, default : Date.now() },
    Due_date : { type : Date, required : false },
    Refs : [{
        refs : { type : String, required : false }
    }],
    Remark : { type : String, required : false },
    Customer : {
        cutomer_id : { type : String, required : false },
        customer_name : { type : String, required : false },
        customer_type : { type : String, required : false },
        customer_tel : { type : String, required : false }
    },
    Status : [{
        status_code : { type : String, required : false },
        status_name : { type : String, required : false },
        sender : { type : String, required : false },
        create_at : { type : Date, required : false }
    }]

}, { versionKey: false });

module.exports = mongoose.model('RequestProject', RequestProjectSchema);