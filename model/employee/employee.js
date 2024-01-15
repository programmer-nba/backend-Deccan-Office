const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
var bcrypt = require("bcrypt");

const EmployeeSchema = new Schema({
    employee_number: {type:Number, required: true},
    userid:{type:String, require: true},
    first_name: {type:String, require: true},
    last_name: {type:String, require: true},
    nick_name: {type:String, require: true},
    iden_number: {type:String, require: true},
    password: {type:String, require: true},
    job_position: {type:String, require: true},
    department: {type:String, require: true},
    level: {type:String, default: "users", require: true},
    tel: {type:Number, require: true},
    address: {type:String, require:true},
    subdistrict: {type:String, require: true},
    district: {type: String, required: true},
    provice: {type: String, required: true},
    postcode: {type: String, required: true},
    birthday: {type: Date, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
},{timestamps: true});

EmployeeSchema.pre('save',function(next){   //ทำ Middleware การ Hash ก่อน EmployeeScheme ที่ User กรอกมาจะ save
  const user = this
  bcrypt.hash(user.password, 10).then(hash => {
      user.password = hash
      next()
  }).catch(error =>{
      console.error(error)
  })
})

const Employees = mongoose.model("employees", EmployeeSchema);

 const Validate = (data)=>{
   const schema = Joi.object({
        employee_number: Joi.number().required().label('กรุณากรอกไอดี'),
        userid: Joi.string().required().label('กรุณากรอกยูสเซอร์ไอดี'),
        first_name: Joi.string().required().label('กรุณากรอกชื่อจริง'),
        last_name: Joi.string().required().label('กรุณากรอกนามสกุล'),
        nick_name: Joi.string().required().label('กรุณากรอกชื่อเล่น'),
        iden_number: Joi.string().required().label('กรุณากรอกบัตรประชาชน'),
        password: Joi.string().required().label('กรุณากรอกรหัสผ่าน'),
        job_position: Joi.string().required().label('กรุณากรอกตำแหน่งงานของท่าน'),
        department: Joi.string().required().label('กรุณากรอกแผนกที่ท่านอยู่'),
        level: Joi.string(),
        tel: Joi.number().required().label('กรุณากรอกหมายเลขโทรศัพท์'),
        address: Joi.string().required().label('กรุณากรอกที่อยู่'),
        subdistrict: Joi.string().required().label('กรุณากรอกตำบล'),
        district: Joi.string().required().label('กรุณากรอกอำเภอ'),
        provice: Joi.string().required().label('กรุณากรอกจังหวัด'),
        postcode: Joi.number().required().label('กรุณากรอกรหัสไปรษณีย์'),
        birthday: Joi.date().required().label('กรุณากรอกวันเกิด'),
        age: Joi.number().required().label('กรุณากรอกอายุ'),
        email: Joi.string().required().label('กรุณากรอกอีเมล์'),
   });
   return schema.validate(data);
 };

module.exports = {Employees, Validate};
