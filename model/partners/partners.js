const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
// Define the schema for the HotelUser entity
const partnerSchema = new mongoose.Schema(
  {
    username: {type: String, required: true,unique: true},
    password: {type: String, required: true},
    partner_name: { type: String, required: true },
    partner_address: { type: String, required: true },
    partner_phone: { type: String, required: true },
    partner_status: { type: Boolean, required: false, default: false },
    partner_status_promiss: {
      type: String,
      required: false,
      default: "รอตรวจสอบ",
    }, //
    partner_bookbank: { type: String, required: false, default: "" }, // images
    partner_bookbank_name: { type: String, required: false, default: "" },
    partner_bookbank_number: { type: String, required: true },
    partner_iden: { type: String, required: false, default: "" }, // images
    partner_iden_number: { type: String, required: true },
    partner_company_name: { type: String, required: false, default: "ไม่มี" },
    partner_company_number: { type: String, required: false, default: "ไม่มี" },
    partner_company_address: { type: String, required: false, default: "ไม่มี" },
    partner_timestamp: { type: Array, required: false, default: [] },
    signature:{type:String,default:""}
  },
  {timestamps: true}
);

partnerSchema.pre('save',function(next){   //ทำ Middleware การ Hash ก่อน EmployeeScheme ที่ User กรอกมาจะ save
    const user = this
    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
        next()
    }).catch(error =>{
        console.error(error)
    })
  })

const Partner = mongoose.model("partner", partnerSchema);

module.exports = Partner;