const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
var bcrypt = require("bcrypt");

const EmployeeSchema = new Schema({
  employee_number: { type: Number, required: true },

  userid: { type: String, require: true },

  first_name: { type: String, require: true },

  last_name: { type: String, require: true },

  nick_name: { type: String, require: true },

  iden_number: { type: String, require: true },

  password: { type: String, require: true },

  role: { type: String, require: false },

  position: { type: String, require: false},

  tel: { type: Number, require: true },

  address: { type: String, require: true },

  subdistrict: { type: String, require: true },

  district: { type: String, required: true },

  provice: { type: String, required: true },

  postcode: { type: String, required: true },

  birthday: { type: String, required: false },

  age: { type: Number, required: true },

  email: { type: String, required: true },
  
}, { timestamps: true });

EmployeeSchema.pre('save', function (next) {   //ทำ Middleware การ Hash ก่อน EmployeeScheme ที่ User กรอกมาจะ save
  const user = this
  bcrypt.hash(user.password, 10).then(hash => {
    user.password = hash
    next()
  }).catch(error => {
    console.error(error)
  })
})

const Employees = mongoose.model("employees", EmployeeSchema);

module.exports = { Employees,  };
