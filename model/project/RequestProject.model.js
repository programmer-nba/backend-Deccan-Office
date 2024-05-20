const mongoose = require('mongoose');

const RequestProjectSchema = new mongoose.Schema({
    code : { type : String, required : false, default: "DWG" }, // TSG
    title : { type : String, required : false, default: "" },
    projectType : { type : String, required : false, default: "" },
    projectSubType : { type : String, required : false, default: "" },
    detail : { type : String, required : false, default: "" }, // require
    startDate : { type : Date, required : false, default : Date.now() },
    dueDate : { type : Date, required : false, default: null },
    refs : { type : Array, required : false, default: [] },
    qty: { type : Number, required : false, default: 1 },
    unit: { type : String, required : false, default: "งาน" },
    billNo : { type : String, required : false, default: "" },
    remark : { type : String, required : false, default: "" },
    customer : {
        _id : { type : String, required : false, default: "" },
        name : { type : String, required : false, default: "" },
        customerType : { type : String, required : false, default: "" },
        customerTel : { type : String, required : false, default: "" }
    },
    sendAddress: { type : String, required : false, default: "" },
    status : { type : Array, required : false, timestamps: true },
    permisses : { type : Array, required : false, default: [] },
    employees : { type : Array, required : false, default: [] },

}, { timestamps: true });

module.exports = mongoose.model('RequestProject', RequestProjectSchema);