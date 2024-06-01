const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

//เพิ่มปลั๊กอิน
dayjs.extend(utc);
dayjs.extend(timezone)

let dayjsTimestamp
//ตั้งค่าโซนเวลาท้องถิ่น
function updateRealTime() {
    dayjsTimestamp = dayjs().tz('Asia/Bangkok');
}
// เรียกใช้ฟังก์ชัน updateRealTime() ทุก 1 วินาที
setInterval(updateRealTime, 500);

const requestTimeSchema = new Schema({
    employee_id:{type:String, require: false},
    employee_number: {type:String, require: false},
    firstname:{type:String, require: false},
    lastname:{type:String, require: false},
    time: { type: String, default: "00:00:00" },
    day: { type: String, require: false },
    mount : { type : String, require : false, default : ""},
    year : { type : String, require : false, default : ""},
    time_line : {type : String, require : false, default : ""},
    status:{ type : String, require : false, default : "รออนุมัติ"},
    remark: { type: String, default: "" },
},{timestamps:true});

const requestTime = mongoose.model("request_updatetime", requestTimeSchema);

module.exports = {requestTime};