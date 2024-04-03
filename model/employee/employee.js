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

  birthday: { type: String, default:"", required: false },

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

EmployeeSchema.pre('save',async function (next) {   //ทำ Middleware การ Hash ก่อน EmployeeScheme ที่ User กรอกมาจะ save
  try{
    const user = this
      bcrypt.hash(user.password, 10).then(hash => {
          user.password = hash
        }).catch(error => {
          console.error(error)
        })
    const findNumber = await Employees.find();
    console.log(findNumber.length)
    const length = findNumber.length + 1;
      // console.log(findNumber)
    
    let data
      if (user.position == 'owner') {
          user.employee_number = 'OWNER';
          next();
      }else if(user.position == 'admin'){
          user.employee_number = 'ADMIN';
          next();
      } else {
        if (user.position == 'programmer') {
          data = 'DEV';
        } else if (user.position == 'graphic') {
          data = 'GRP';
        } else if (user.position == 'accounting') {
          data = 'ACC';
        } else if (user.position == 'manager') {
          data = 'MGR';
        }
        if (findNumber.length == 0) {
          user.employee_number = data + String(length).padStart(6, '0');
        } else {
            const sortedEmployees = await findNumber.filter(employee => {
              // ถ้า employee_number เป็นตัวเลขสามารถแปลงเป็นตัวเลขได้ เราจะเก็บรายการนี้
              // console.log(employee)
                if (!isNaN(parseInt(employee.employee_number.substring(3), 10))) {
                    return true; // เก็บรายการที่เป็นตัวเลขเท่านั้น
                }
                return false; // กรองออกถ้าไม่สามารถแปลงเป็นตัวเลขได้
            }).sort((a, b) => {
                const numberA = parseInt(a.employee_number.substring(3), 10);
                const numberB = parseInt(b.employee_number.substring(3), 10);
                return numberB - numberA;
            });
            let number = 1;
              if (sortedEmployees.length > 0) {
                  number = parseInt(sortedEmployees[0].employee_number.substring(3), 10) + 1;
              }
            const stringNumber = String(number).padStart(6, '0');
            console.log(stringNumber);
            user.employee_number = data + stringNumber;
        }
        next();
      }
  }catch(err){
    console.error(err);
    next(err);
  }
  
})

const Employees = mongoose.model("employees", EmployeeSchema);

module.exports = { Employees};