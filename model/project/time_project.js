const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const projectSchema = new Schema({
    project_name: {type:String, require: true},
    date: {type:Date, require: true},
    dead_line: {type: Date, require: true},
    employee: {type: Array, require: false},
    TOR:{type: String, require: false}
    
});

const timeInOut = mongoose.model("TimeInOut", timeSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         employee_id: Joi.string().required().label('กรุณากรอกรหัสพนักงาน'),
         break_time: Joi.date(),
         limit_time: Joi.date()
    });
    return schema.validate(data);
  };

module.exports = {timeInOut, Validate };