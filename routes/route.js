const router = require('express').Router();
const main = require('../controllers/main.controller');

//login & register
router.route('/ddsc-office/post').post(main.postRegister) //ใช้กำหนด path ที่ต้องการทำให้ไม่ต้องไปประกาศใน File Server แล้ว

module.exports = router;