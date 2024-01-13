const router = require('express').Router();
const main = require('../controllers/Employees/employeeController');
const regis = require('../controllers/Employees/registerController');
const login = require('../controllers/Employees/loginController');
const time = require('../controllers/Employees/timeController')
const auth = require("../lib/auth");

//CRUD employees table
router.route('/ddsc-office/post').post(auth, main.Post) //ใช้กำหนด path ที่ต้องการทำให้ไม่ต้องไปประกาศใน File Server แล้ว
router.route('/ddsc-office/get').get(auth, main.getAll)
router.route('/ddsc-office/getid/:id').get(auth, main.getByID)
router.route('/ddsc-office/update/:id').put(auth, main.Update)
router.route('/ddsc-office/del/:id').delete(auth, main.Delete)

//Register
router.route('/ddsc-office/register').post( regis.CreateRegister )

//Login
router.route('/ddsc-office/login').post( login.loginController )

//TimeInOut
router.route('/ddsc-office/time').post( time.timeIn )

module.exports = router;