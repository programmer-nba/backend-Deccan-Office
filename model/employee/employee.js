const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
var bcrypt = require("bcrypt");

const EmployeeSchema = new Schema({
  employee_number: { type: String, default:"", required: false },

  userid: { type: String, default:"", require: false },

  name_title: { type: String, require: false },

  first_name: { type: String, require: false },

  last_name: { type: String, require: false },

  nick_name: { type: String, default:"", require: false },

  iden_number: { type: String, require: false },

  password: { type: String, default:"", require: false },

  role: { type: String, require: false },

  position: { type: String, require: false},

  tel: { type: Number, default:"", require: false },

  address: { type: String, default:"", require: false },

  subdistrict: { type: String, default:"", require: false },

  district: { type: String, default:"", required: false },

  provice: { type: String, default:"", required: false },

  postcode: { type: String, default:"", required: false },

  birthday: { type: Date, default:null, required: false },

  age: { type: Number, default:0, required: false },

  email: { type: String, default:"", required: false },

  blacklist : {type: Boolean, default:false, required: false},

  salary: { type: Number, default:0, required: false },
  
  leave:{
      business_leave: { type: Number, default:7, required: false }, //ลากิจ
      sick_leave: { type: Number, default:30, required: false }, //ลาป่วย
      annual_leave: { type: Number, default:4, required: false }, //ลาพักร้อน
      disbursement: { type: Number, default:3000, required: false } //การเบิกจ่าย
  }
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

module.exports = { Employees};