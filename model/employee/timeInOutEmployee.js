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
    employee_number: {type:Number, require: true},
    period: {type:String},
    time_in: {type:Date, default:Date.now},
    time_out: {type: Date}
});

timeSchema.pre('save', function(next) {
    //ตรวจสอบช่วงเวลาที่ทำการเริ่มงานเข้ามา
    if(this.period == "morning"){
        this.time_out = dayjs(this.time_in).add(3, 'hour').toDate();
    }
    if(this.period == "afternoon"){
        this.time_out = dayjs(this.time_in).add(5, 'hour').toDate();
    }
    if(this.period == "day"){
        this.time_out = dayjs(this.time_in).add(9, 'hour').toDate();
    }

    /*//เปลี่ยน Time Zone จาก UTC เป็น ประเทศไทย (**เปลี่ยน timezone สำเร็จแต่พอบันทึกลง mongoDB ระบบของ database จะบันทึกเป็น UTC อัตโนมัติ **แก้ไขไม่ได้)
    this.time_in = dayjs(this.time_in).tz(timeZone).toDate();
    this.time_out = dayjs(this.time_out).tz(timeZone).toDate();*/
    console.log(dayjs(this.time_in).format())//แสดง time_in ว่าสามารถเปลี่ยน Time Zone ได้ไหม
    console.log(dayjs(this.time_out).format())//แสดง time_out ทดสอบว่าสามารถเปลี่ยน Time Zone ได้ไหม
    next();
});

const timeInOut = mongoose.model("TimeInOut", timeSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         employee_number: Joi.number().required().label('กรุณากรอกรหัสพนักงาน'),
         period: Joi.string().required().label('กรุณาระบุช่วงเวลาทำงาน'),
         time_in: Joi.date(),
         time_out: Joi.date()
    });
    return schema.validate(data);
  };

module.exports = {timeInOut, Validate };
