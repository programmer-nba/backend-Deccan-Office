const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const partnerSchema = new mongoose.Schema(
  {
    username: {type: String, required: true,unique: true},
    password: {type: String, required: true},
    firstname:{type:String, required:true},
    lastname :{type:String,required:true},
    name: {type: String, required: true},
    telephone :{type:String,required : true},
    email:{type:String,required:true},
    address :{type:String,required:true},
    provice:{type:String,required:true},
    amphure:{type:String,required:true},
    tambon :{type:String,required:true},
    postcode:{type:String,required:true},
    position:{type:String,required:true},
    idcard:{type:String,required:true},
    fileidcard:{type:String,default:""},
    image:{type:String,default:""}
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