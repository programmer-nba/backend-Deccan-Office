const mongoose = require("mongoose");
const Joi = require("joi");

const EmployeeSchema = new mongoose.Schema({
  employee_number: {type: Number, required: false},
  frist_name: {type: String, required: true},
  last_name: {type: String, required: true},
  nick_name: {type: String, required: true},
  iden_number: {type: String, required: true},
  password: {type: String, required: true},
  tel: {type: String, required: true},
  address: {type: String, required: true},
  subdistrict: {type: String, required: true},
  district: {type: String, required: true},
  provice: {type: String, required: true},
  postcode: {type: String, required: true},
  birthday: {type: Date, required: true},
  age: {type: Number, required: true},
  email: {type: String, required: true},
});

const Employees = mongoose.model("employee", EmployeeSchema);

const validate = (data) => {
  const schema = Joi.object({
    frist_name: Joi.string().required().label("กรุณากรอกชื่อ"),
    last_name: Joi.string().required().label("กรุณากรอกนามสกุล"),
    nick_name: Joi.string().required().label("กรุณากรอกชื่อเล่น"),
    iden_number: Joi.string().required.label("กรุณากรอกเลขบัตรประชาชน"),
    password: Joi.string().required().label('กรุณากรอกพาสเวิร์ด'),
    tel: Joi.string().required().label("กรุณากรอกเบอร์โทรศัพท์"),
    address: Joi.string().required().label("กรุณากรอกที่อยู่"),
    subdistrict: Joi.string().required().label("กรุณากรอกตำบล"),
    district: Joi.string().required().label("กรุณากรอกอำเภอ"),
    provice: Joi.string().required().label("กรุณากรอกจังหวัด"),
    postcode: Joi.string().required().label("กรุณากรอกรหัสไปรษณีย์"),
    birthday: Joi.date().required().label("กรุณากรอกวันเดือนปีเกิด"),
    age: Joi.number().required().label("กรุณากรอกอายุ"),
    email: Joi.string().required().label("กรุณากรอกอีเมล"),
  });
  return schema.validate(data);
};

module.exports = {Employees, validate};
