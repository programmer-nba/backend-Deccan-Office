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
dayjsTimestamp = dayjs().tz('Asia/Bangkok');

const timeSchema = new Schema({
    employee_id:{type:String, require: true},
    day:{ type: String, default: () => dayjsTimestamp.format('DD') },
    mount:{ type: String, default: () => dayjsTimestamp.format('MM') },
    year:{ type: String, default: () => dayjsTimestamp.format('YYYY') },
    time: { type: String, default: "00:00:00" },
    time_line: { type: String, require: false },
},{timestamps:true});

timeSchema.pre('save', function (next) { 
    const time = dayjsTimestamp.format('YYYY-MM-DD HH:mm:ss')
    console.log(time)
    next()
})

const timeInOut = mongoose.model("TimeInOut", timeSchema);

module.exports = {timeInOut};
