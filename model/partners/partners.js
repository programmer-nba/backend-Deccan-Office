const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
// Define the schema for the HotelUser entity
const partnerSchema = new mongoose.Schema(
  {
    //บุคคล
    username: {type: String, required: true,unique: true}, 
    password: {type: String, required: true},
    antecedent:{type:String,required:true},
    partner_name: { type: String, required: true },
    partner_phone: { type: String, required: true },
    partner_email:{type:String,required:true},
    partner_iden_number: { type: String, required: true },
    partner_address: { type: String, required: true },
    //otp
    status_opt :{ type: Boolean, default: false },
    status_appover :{type:String,default:"ยังกรอกข้อมูลไม่ครบ"},


    // นิติบุคคล 
    partner_iden: { type: String, required: false, default: "" }, // เลขบัตรประชาชน

    /// บริษัท
    partner_company_name: { type: String, required: false, default: "" },
    partner_company_number: { type: String, required: false, default: "" },
    partner_company_address: { type: String, required: false, default: "" },  
    partner_company_phone:{type:String,default:""},
    filecompany:{type:String,default:""},
    logo:{type:String,default:""},
    // ลายเซ็นต์
    signature:{type:[{
      name: {type:String},
      role: {type:String},
      position: {type:String},
      sign: {type:String}
    }],default:null},
    partner_timestamp: { type: Array, required: false, default: [] },
  },
  {timestamps: true}
);


const Partner = mongoose.model("partner", partnerSchema);

module.exports = Partner;