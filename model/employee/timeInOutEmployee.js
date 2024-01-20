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
    period: {type:String},
    time_in: {type:Date, default:Date.now},
    time_out: {type: Date}
},{timestamps:true});

timeSchema.pre('save', function(next) {
    //ตรวจสอบช่วงเวลาที่ทำการเริ่มงานเข้ามา
    /*if(this.period == "morning"){
        this.time_out = dayjs().set('hour', 12).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
    } else if(this.period == "afternoon"){
        this.time_out = dayjs().set('hour', 18).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
    } else if(this.period == "day"){
        this.time_out = dayjs().set('hour', 18).set('minute', 0).set('second', 0).set('millisecond', 0).toDate();
    }*/

    // เปลี่ยน Time Zone จาก UTC เป็น ประเทศไทย
    this.time_in = dayjs(this.time_in).tz(timeZone).toDate();
    this.time_out = dayjs(this.time_out).tz(timeZone).toDate();

    console.log(dayjs(this.time_in).format()); // แสดง time_in ว่าสามารถเปลี่ยน Time Zone ได้ไหม
    console.log(dayjs(this.time_out).format()); // แสดง time_out ทดสอบว่าสามารถเปลี่ยน Time Zone ได้ไหม
    
    next();
});

const timeInOut = mongoose.model("TimeInOut", timeSchema);

const Validate = (data)=>{
    const schema = Joi.object({
        employee_id: Joi.string().required().label('กรุณากรอกบัตรประชาชนพนักงาน'),
        period: Joi.string().required().label('กรุณาระบุช่วงเวลาทำงาน'),
        time_in: Joi.date(),
        time_out: Joi.date()
    });
    return schema.validate(data);
  };

module.exports = {timeInOut, Validate };
