const jwt = require('jsonwebtoken');
const Userinfo = require('./model/Userinfo/Userinfo'); // Import Userinfo model ที่จะใช้ดึงข้อมูลผู้ใช้

const admin = async (req, res, next) => {
    try {
        let token = req.headers["token"];
        // เช็ค token
        if (!token) {
            return res.status(403).send({ status: false, message: 'กรุณากรอก token' });
        }
        const secretKey = "loginload";
        // ทำการยืนยันสิทธิ์ token
        const decoded = jwt.verify(token, secretKey);
        if (decoded.role === "admin") {
            console.log('You are admin');
            req.users = decoded.data;
            next();
        } else {
            console.log('คุณไม่มีสิทธิ์ Admin');
            return res.status(400).send({ status: false, message: "คุณไม่มีสิทธิ่ในการใช้งาน" });
        }
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
};

const user = async (req, res, next) => {
    try {
        let token = req.headers["token"];
        // เช็ค token
        if (!token) {
            return res.status(403).send({ status: false, message: 'กรุณากรอก token' });
        }
        const secretKey = "loginload";
        // ทำการยืนยันสิทธิ์ token
        const decoded = jwt.verify(token, secretKey);
        if (decoded.role === "User") {
            console.log('You are User');
            console.log(decoded)
            req.decoded = decoded
            next();
        } else {
            return res.status(400).send({ status: false, message: "คุณไม่มีสิทธิ่ในการใช้งาน" });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ error: err.message });
    }
};

const all = async (req, res, next) => {
    try {
        let token = req.headers["token"];
        // เช็ค token
        if (!token) {
            return res.status(403).send({ status: false, message: 'กรุณากรอก token' });
        }
        const secretKey = "loginload";
        // ทำการยืนยันสิทธิ์ token
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        
        // ดึงข้อมูลผู้ใช้จาก Userinfo โดยใช้ ID จาก decoded data
        const userinfo = await Userinfo.findById(decoded.data._id);
        if (!userinfo) {
            return res.status(404).send({ status: false, message: 'ไม่พบข้อมูลผู้ใช้' });
        }
        
        // เก็บข้อมูลผู้ใช้ใน req.user เพื่อนำไปใช้ในฟังก์ชันต่อไป
        req.user = userinfo;
        
        next();
    } catch (err) {
        return res.status(500).send({ error: err.message });
    }
};

const authuser = {
    admin,
    user,
    all
};

module.exports = authuser;
