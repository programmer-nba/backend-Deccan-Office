const router = require('express').Router();
const main = require('../controllers/Employees/employeeController');
const regis = require('../controllers/Employees/registerController');
const login = require('../controllers/Employees/loginController');
const timein = require('../controllers/Employees/timeInOutController')
const time = require('../controllers/Employees/timeController')
const auth = require("../lib/auth");
const authAdmin = require("../lib/authAdmin");

//CRUD employees table
router.route('/ddsc-office/post').post(authAdmin, main.Post) //ใช้กำหนด path ที่ต้องการทำให้ไม่ต้องไปประกาศใน File Server แล้ว
router.route('/ddsc-office/get').get(authAdmin, main.getAll)
router.route('/ddsc-office/getid/:id').get(authAdmin, main.getByID)
router.route('/ddsc-office/update/:id').put(authAdmin, main.Update)
router.route('/ddsc-office/del/:id').delete(authAdmin, main.Delete)

//Register
router.route('/ddsc-office/register').post( regis.CreateRegister )

//Login
router.route('/ddsc-office/login').post( login.loginController )

//TimeInOut
router.route('/ddsc-office/time').post( timein.timeIn )

//getTime
router.route('/ddsc-office/gettime').get( time.getTimeByOne )

module.exports = router;