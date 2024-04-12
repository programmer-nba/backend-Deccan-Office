require("dotenv").config();
const jwt = require("jsonwebtoken");

Admin = async (req, res, next) => {
    try{
        let token = req.headers["auth-token"]
        //เช็ค token
        if(token == "" || token == null || token == undefined){
            return res.status(403).send({status:false,message:'กรุณากรอก token'});
        }
        // const secretKey = "loginload"
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,process.env.JWTPRIVATEKEY)
        console.log(decoded.role)
        if(decoded.role ==="admin" || decoded.role ==="owner" || decoded.role ==="manager" || decoded.role ==="head_department"){
            console.log('You are ' + decoded.role)
            req.decoded = decoded
            next();
        }else{
            console.log('คุณไม่มีสิทธิ์ Admin , Owner , Manager , head_department')
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }catch (err){
        console.log(err)
        return res.status(500).send({error:err})
    }
}

module.exports = Admin;