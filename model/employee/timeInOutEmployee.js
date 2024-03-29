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
    morning_timeIn: { type: String, default: () => dayjs(Date.now()).format('HH:mm:ss') },
    status_morningIn: {type:Boolean, default: true},
    morning_timeOut: { type: String, default: "00:00:00" },
    status_morningOut: {type:Boolean, default: false},
    after_timeIn: { type: String, default: "00:00:00"},
    status_afterIn: {type:Boolean, default: false},
    after_timeOut: { type: String, default: "00:00:00"},
    status_afterOut: {type:Boolean, default: false},
},{timestamps:true});

const timeInOut = mongoose.model("TimeInOut", timeSchema);

module.exports = {timeInOut};
