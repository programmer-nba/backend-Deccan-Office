const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const recordSchema = new Schema({
    title: {type: String, require: true},
    detail: {type: String, require: true},
    number_report: {type: Number, require: false},
    amount: {type: String, require: false},
    status: {type: String, default:"รออนุมัติ", require: false},
    time_in: {type: String, require: false},
    time_out: {type: String, require: false},
    date_in: {type: String, require: false},
    date_out: {type: String, require: false}
},{timestamps:true});

const recordReport = mongoose.model("record", recordSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         title: Joi.string().required().label('กรุณากรอกหัวข้อบันทึกข้อความ'),
         detail: Joi.string().required().label('กรุณากรอกรายละเอียด'),
         number_report: Joi.number(),
         amount: Joi.string().required().label('กรุณากรอกจำนวนคน'),
         status: Joi.string(),
         time_in: Joi.string().required().label('กรุณากรอกเวลาเข้า'),
         time_out: Joi.string().required().label('กรุณากรอกเวลาออก'),
         date_in: Joi.string(),
         date_out: Joi.string(),
         
    });
    return schema.validate(data);
  };

module.exports = { recordReport, Validate };