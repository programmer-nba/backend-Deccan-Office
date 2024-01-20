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
         project_name: Joi.string().required().label('กรุณากรอกรหัสพนักงาน'),
         date: Joi.date(),
         dead_line: Joi.date(),
         employee: Joi.array(),
         TOR:{type: string, require: false}
    });
    return schema.validate(data);
  };

module.exports = {timeInOut, Validate };