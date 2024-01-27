const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const recordSchema = new Schema({
    title: {type: String, require: true},
    detail: {type: String, require: true},
    number_report: {type: Number, require: false},
    amount: {type: String, require: false},
    status: {type: String, default:"NEW", require: false},
    time_in: {type: String, require: false},
    time_out: {type: String, require: false},
    date_in: {type: String, require: false},
    date_out: {type: String, require: false}
},{timestamps:true});

recordSchema.plugin(AutoIncrement, { inc_field: 'number_report', start_seq: '0001', prefix: '0000' }).toString().padStart(4, '0');

recordSchema.pre('save', async function(next) { 
  // เช็คว่าไม่ใช่ครั้งแรกที่บันทึก
  if (this.isNew) {
      try {
          const lastRecord = await this.constructor.findOne({}, {}, { sort: { 'number_report': -1 } });
          if (lastRecord) {
              // หากมี record อื่นอยู่ ให้เพิ่มค่า number_report ทีละ 1
              const lastNumber = parseInt(lastRecord.number_report);
              this.number_report = (lastNumber + 1).toString().padStart(4, '0');
          } else {
              // หากไม่มี record อื่นอยู่ในฐานข้อมูล
              this.number_report = '0001';
          }
      } catch (error) {
          console.error(error);
      }
  }

  next();
});

const recordReport = mongoose.model("record", recordSchema);

const Validate = (data)=>{
    const schema = Joi.object({
         title: Joi.string().required().label('กรุณากรอกหัวข้อบันทึกข้อความ'),
         detail: Joi.string().required().label('กรุณากรอกรายละเอียด'),
         number_report: Joi.number(),
         amount: Joi.string().required().label('กรุณากรอกจำนวนคน'),
         status: Joi.string(),
         time_in: Joi.string().required().label('กรุณากรอกเวลาเข้า'),
         time_out: Joi.string().required().label('กรุณากรอกเวลาออก'),
         date_in: Joi.string(),
         date_out: Joi.string(),
         
    });
    return schema.validate(data);
  };

module.exports = { recordReport, Validate };