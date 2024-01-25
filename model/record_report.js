const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const recordSchema = new Schema({
    title: {type: String, require: true},
    detail: {type: String, require: true},
    number: {type: String, require: true},
    date_in: {type: String, require: false},
    date_out:{type: String, require: false}  
},{timestamps:true});

const recordReport = mongoose.model("record", recordSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         title: Joi.string().required().label('กรุณากรอกหัวข้อบันทึกข้อความ'),
         detail: Joi.string().required().label('กรุณากรอกรายละเอียด'),
         number: Joi.string().required().label('กรุณากรอกหมายเลข'),
         date_in: Joi.string().required().label('กรุณากรอกเวลาเข้า'),
         date_out: Joi.string().required().label('กรุณากรอกเวลาออก'),
    });
    return schema.validate(data);
  };

module.exports = { recordReport, Validate };