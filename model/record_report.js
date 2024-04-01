const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const recordSchema = new Schema({
    title: {type: String, require: false},
    detail: {type: String, require: false},
    number_report: {type: String, require: false},
    amount: {type: String, require: false},
    status: {type: String, default:"รออนุมัติ", require: false},
    time_in: {type: String, require: false},
    time_out: {type: String, require: false},
    date_in: {type: String, require: false},
    date_out: {type: String, require: false}
},{timestamps:true});

recordSchema.pre('save',async function (next) {
  try {
    const user = this;
    const findNumber = await recordReport.find();
    const length = findNumber.length + 1;
    
    if(length <= 99){
      // สร้างค่า number_report ใหม่โดยเพิ่มเลข 0 ข้างหน้าเสมอ ให้ความยาวเป็น 3 หลัก
      user.number_report = String(length).padStart(3, '0');
    }else{
      user.number_report = String(parseInt(user.number_report) + 1);
    }

    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
})

const recordReport = mongoose.model("record", recordSchema);

module.exports = { recordReport};