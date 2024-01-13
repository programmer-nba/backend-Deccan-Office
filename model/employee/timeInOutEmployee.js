const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const timeSchema = new Schema({
    employee_number: {type:Number},
    time_in: {type:Date, require: true},
    time_out: {type:Date}
});

const timeInOut = mongoose.model("TimeInOut", timeSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         employee_number: Joi.number(),
         time_in: Joi.date().required().label('ไม่พบเวลาเข้า'),
         time_out: Joi.date()
    });
    return schema.validate(data);
  };
 
 module.exports = {timeInOut, Validate};
 