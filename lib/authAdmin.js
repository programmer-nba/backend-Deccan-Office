require("dotenv").config();
const jwt = require("jsonwebtoken");

Admin = async (req, res, next) => {
    try{
        let token = req.headers["token"]
        //เช็ค token
        if(token == "" || token == null || token == undefined){
            return res.status(403).send({status:false,message:'กรุณากรอก token'});
        }
        const secretKey = "loginload"
        // ทำการยืนยันสิทธิ์ token
        const decoded =  jwt.verify(token,secretKey)
        console.log('let me chack your role !!!')
        if(decoded.role ==="admin" || decoded.role ==="owner" || decoded.role ==="manager"){
            console.log('You are ' + decoded.role)
            req.users = decoded.data
            next();
        }else{
            console.log('คุณไม่มีสิทธิ์ Admin , Owner , Manager')
            return res.status(400).send({status:false,message:"คุณไม่มีสิทธิ่ในการใช้งาน"})
        }
    }catch (err){
        return res.status(500).send({error:err.message})
    }
}

const authuser = {
    Admin
};

module.exports = checkToken;