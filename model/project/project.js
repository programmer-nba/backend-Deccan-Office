const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const projectSchema = new Schema({
    project_name: {type:String, require: true},
    date: {type:String, require: true},
    dead_line: {type: String, require: true},
    employee: [
      {
        employee_number: {type: String, require: false},
        department: {type: String, require: false},
        job_position: {type: String, require: false},
        name: {type: String, require: false},
        detail: {type: String, require: false}
      }
    ],
    TOR:[
      {
        title: {type: String, require: false},
        detail: {type: Array, require: false},
      }
    ]
});

const projectTime = mongoose.model("project", projectSchema);

const Validate = (data)=>{
    const schema = Joi.object({
          project_name: Joi.string().required().label('กรุณากรอกชื่อ Project'),
          date: Joi.date().required().label('กรุณากรอกเริ่ม Project'),
          dead_line: Joi.date().required().label('กรุณากรอกวันสิ้นสุดการทำ'),
          employee: Joi.array().items(Joi.object({
            employee_number: Joi.string(),
            department: Joi.string(),
            job_position: Joi.string(),
            name: Joi.string(),
            detail: Joi.string()
          })),
          TOR: Joi.array().items(Joi.object({
            title: Joi.string(),
            detail: Joi.array(),
          }))
    });
    return schema.validate(data);
  };

module.exports = {projectTime, Validate };