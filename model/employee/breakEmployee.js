const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const breakSchema = new Schema({
    employee_id: {type:String, require: true},
    break_time: {type:Date, default:Date.now},
    limit_time: {type: Date}
},{timestamps:true});

const breakTime = mongoose.model("TimeInOut", breakSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         employee_id: Joi.string().required().label('กรุณากรอกรหัสพนักงาน'),
         break_time: Joi.date(),
         limit_time: Joi.date()
    });
    return schema.validate(data);
  };

module.exports = {breakTime, Validate };