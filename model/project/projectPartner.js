const mongoose = require("mongoose");
const Schema = mongoose.Schema
const Joi = require("joi");

const projectPartnerSchema = new Schema({
    project_number: {type:String, require: true},
    type: {type:String, require: true},
    project_name: {type:String, require: true},
    price: {type:String, require: true},
    detail: {type:String, require: false}
},{timestamps:true});

projectPartnerSchema.pre('save',async function(next){  
    const user = this 
    // สุ่มหมายเลขในช่วง 150000-159999
    const randomShopNumber = Math.floor(Math.random() * (159999 - 150000 + 1)) + 150000;
  
    // ตรวจสอบว่าหมายเลขนี้ไม่ซ้ำกับหมายเลขอื่น ๆ ในฐานข้อมูล
    const existingShop = await user.constructor.findOne({ project_number: randomShopNumber });

    if (existingShop) {
      // ถ้าซ้ำให้สุ่มใหม่
      return projectPartnerSchema.pre('save', next);
    }
    // กำหนดหมายเลขให้กับ shop_number
    user.project_number = randomShopNumber;
    next();
  })
const projectPartner = mongoose.model("project_partner", projectPartnerSchema);

module.exports = {projectPartner};