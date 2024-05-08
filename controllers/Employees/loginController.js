const bcrypt = require('bcrypt')
var jwt = require("jsonwebtoken");
const { Employees } = require("../../model/employee/employee");

loginController = async(req,res) =>{
    try{
        const UserID = req.body.userid //รับ UserId ที่ User กรอกมา
        const Password = req.body.password //รับ Password ที่ User กรอกมา
        Employees.findOne({
            $or: [
            { userid: UserID },
            { iden_number: UserID }
        ]}).then((Employees)=>{
            if(Employees){
                let cmp = bcrypt.compare(Password, Employees.password).then((match)=>{
                    console.log(Employees.password)
                    if(match){
                        const secretKey = process.env.JWTPRIVATEKEY
                        const payload = {
                            id: Employees._id,
                            user_id: Employees.userid,
                            role: Employees.role,
                            position: Employees.position
                        }
                        const token = jwt.sign(payload, secretKey, { expiresIn: '365D'})
                        return res
                                .status(200)
                                .send({status:true,
                                    message:"เข้าสู่ระบบสำเร็จ",
                                    token: token,
                                    id: Employees._id,
                                    user_id: Employees.userid,
                                    role: Employees.role,
                                    position: Employees.position,
                                    firstname: Employees.first_name,
                                    lastname: Employees.last_name,
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
