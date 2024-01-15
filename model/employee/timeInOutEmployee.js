const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// เพิ่มปลั๊กอิน
dayjs.extend(utc);
dayjs.extend(timezone);

// ตั้งค่าโซนเวลาท้องถิ่น
const timeZone = 'Asia/Bangkok';
dayjs.tz.setDefault(timeZone);

const timeSchema = new Schema({
    employee_number: {type:Number, require: true},
    time_in: {type:Date, default:Date.now()},
    time_out: {type:Date, default:Date.now()}
});


timeSchema.pre('save', function(next) {
    this.time_in = dayjs(this.time_in).tz(timeZone).toDate();
    this.time_out = dayjs(this.time_out).tz(timeZone).toDate();
    console.log(dayjs(this.time_in).format())//แสดง time_in ว่าสามารถเปลี่ยน Time Zone ได้ไหม
    console.log(dayjs(this.time_out).format())//แสดง time_out ทดสอบว่าสามารถเปลี่ยน Time Zone ได้ไหม
    next();
});


const timeInOut = mongoose.model("TimeInOut", timeSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         employee_number: Joi.number().required().label(),
         time_in: Joi.date().timeZone('Asia/Bangkok'),
         time_out: Joi.date()
    });
    return schema.validate(data);
  };

module.exports = {timeInOut, Validate};
