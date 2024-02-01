const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const contractSchema = new Schema({
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

const contractData = mongoose.model("contract", contractSchema);

module.exports = {contractData};