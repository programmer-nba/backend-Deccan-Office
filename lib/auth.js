require("dotenv").config();
const jwt = require("jsonwebtoken");

checkToken = async(req, res, next)=>{
    try{
        let token = req.headers["auth-token"];
        if (token){
            token = token.replace(/^Bearer\s+/, "");
            console.log(token)
            jwt.verify(token, process.env.JWTPRIVATEKEY, (err, decoded)=>{
                if (err){
                    return res
                        .status(408)
                        .json({
                        success: false,
                        message: "หมดเวลาใช้งาน",
                        logout: true,
                        description: "Request Timeout"
                    })
                }
                req.decoded = decoded
                console.log(decoded)
                next();
            })
        } else { 
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Token not provided Token ไม่ถูกต้อง",
                    logout: false,
                    description: "Unauthorized"
                })
        }
    } catch(err){
        console.log(err)
        return res
            .status(500)
            .send({message: "มีบางอย่างผิดพลาด"})
    }
}
module.exports = checkToken;