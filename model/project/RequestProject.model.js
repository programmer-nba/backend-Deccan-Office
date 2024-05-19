const mongoose = require('mongoose');

const RequestProjectSchema = new mongoose.Schema({
    
    title : { type : String, required : false },
    projectType : { type : String, required : false },
    projectSubType : { type : String, required : false },
    detail : { type : String, required : false },
    startDate : { type : Date, required : false, default : Date.now() },
    dueDate : { type : Date, required : false },
    refs : { type : Array, required : false },
    billNo : { type : String, required : false },
    remark : { type : String, required : false },
    customer : {
        _id : { type : String, required : false },
        name : { type : String, required : false },
        customerType : { type : String, required : false },
        customerTel : { type : String, required : false }
    },
    status : { type : Array, required : false },
    permisses : { type : Array, required : false },
    employees : { type : Array, required : false },

}, { timestamps: true });

module.exports = mongoose.model('RequestProject', RequestProjectSchema);