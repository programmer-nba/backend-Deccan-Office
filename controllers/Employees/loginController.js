const bcrypt = require('bcrypt')
var jwt = require("jsonwebtoken");
const { Employees } = require("../../model/employee/employee");

loginController = async(req,res) =>{
    try{
        const UserID = req.body.iden_number //รับ UserId ที่ User กรอกมา
        const Password = req.body.password //รับ Password ที่ User กรอกมา
        Employees.findOne({iden_number:UserID}).then((Employees)=>{
            if(Employees){
                let cmp = bcrypt.compare(Password, Employees.password).then((match)=>{
                    console.log(match)
                    if(match){
                        const secretKey = process.env.JWTPRIVATEKEY
                        const payload = {
                            user_id: Employees.first_name,
                            email: Employees.email,
                            level: Employees.level
                        }
                        const token = jwt.sign(payload, secretKey, { expiresIn: '90 years'})
                        return res
                                .status(200)
                                .send({status:true,
                                    message:"เข้าสู่ระบบสำเร็จ",
                                    token: token,
                                    employee_number: Employees.employee_number,
                                    firstname: Employees.first_name,
                                    lastname: Employees.last_name,
                                    level: Employees.level,
                                })
                    }else{
                        return res
                                .status(400)
                                .send({status:false,
                                    message:"รหัสผิดพลาด",})
                    }
                })
            } else {
                res
                .status(400)
                .send({status:false,
                    message: "ไม่มีบัญชีที่ท่านใช้"})
            }
        })
    }catch(err){
        console.log(err);
        return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
    }
}
module.exports = { loginController };
