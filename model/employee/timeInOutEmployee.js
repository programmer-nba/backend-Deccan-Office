const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

//เพิ่มปลั๊กอิน
dayjs.extend(utc);
dayjs.extend(timezone)

//ตั้งค่าโซนเวลาท้องถิ่น
const timeZone = 'UTC';
dayjs.tz.setDefault(timeZone);

const timeSchema = new Schema({
    employee_id:{type:String, require: true},
    day:{ type: String, default: () => dayjs(Date.now()).format('DD') },
    mount:{ type: String, default: () => dayjs(Date.now()).format('MM') },
    year:{ type: String, default: () => dayjs(Date.now()).format('YYYY') },
    time_in: { type: String, default: () => dayjs(Date.now()).format('HH:mm:ss') },
    status_timeIn: {type:String, default: "true", require: false},
    time_out: { type: Date, default: () => new Date().setUTCHours(0, 0, 0, 0)},
    status_timeOut: {type:String, default: "false", require: false},
},{timestamps:true});


const timeInOut = mongoose.model("TimeInOut", timeSchema);

const Validate = (data)=>{
    const schema = Joi.object({
        employee_id: Joi.string().required().label('กรุณากรอกบัตรประชาชนพนักงาน'),
        day: Joi.string(),
        mount: Joi.string(),
        year: Joi.string(),
        time_in: Joi.string(),
    });
    return schema.validate(data);
  };

module.exports = {timeInOut, Validate };
