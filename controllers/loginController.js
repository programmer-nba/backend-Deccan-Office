const bcrypt = require('bcrypt')
var jwt = require("jsonwebtoken");
const { Employees } = require("../model/employee/employee");

loginController = async(req,res) =>{
    try{
        const UserID = req.body.iden_number //รับ UserId ที่ User กรอกมา
        const Password = req.body.password //รับ Password ที่ User กรอกมา
        Employees.findOne({iden_number:UserID}).then((Employees)=>{
            if(Employees){
                let cmp = bcrypt.compare(Password, Employees.password).then((match)=>{
                    console.log(match)
                    if(match){
                        return res
                                .status(200)
                                .send({message:"เข้าสู่ระบบสำเร็จ"})
                    }else{
                        return res
                                .status(400)
                                .send({message:"รหัสผิดพลาด"})
                    }
                })
            } else {
                res
                .status(400)
                .send({message: "ไม่มีบัญชีที่ท่านใช้"})
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}
module.exports = { loginController };
