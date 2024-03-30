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
const timeZone = 'Asia/Bangkok';
dayjs.tz.setDefault(timeZone);

const timeSchema = new Schema({
    employee_id:{type:String, require: true},
    day:{ type: String, default: () => dayjs(Date.now()).format('DD') },
    mount:{ type: String, default: () => dayjs(Date.now()).format('MM') },
    year:{ type: String, default: () => dayjs(Date.now()).format('YYYY') },
    time: { type: String, default: "00:00:00" },
    time_line: { type: String, require: false },
},{timestamps:true});

const timeInOut = mongoose.model("TimeInOut", timeSchema);

module.exports = {timeInOut};
