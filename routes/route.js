const router = require('express').Router();
const main = require('../controllers/Employees/employeeController');
const regis = require('../controllers/Employees/registerController');
const login = require('../controllers/Employees/loginController');
const time = require('../controllers/Employees/timeInOutController')
const auth = require("../lib/auth");
const authAdmin = require("../lib/authAdmin");

//CRUD employees table(Admin Only)
router.route('/ddsc-office/post').post(authAdmin, main.Post) //ใช้กำหนด path ที่ต้องการทำให้ไม่ต้องไปประกาศใน File Server แล้ว
router.route('/ddsc-office/get').get(authAdmin, main.getAll)
router.route('/ddsc-office/getid/:id').get(authAdmin, main.getByID)
router.route('/ddsc-office/update/:id').put(authAdmin, main.Update)
router.route('/ddsc-office/del/:id').delete(authAdmin, main.Delete)

//GET ME
router.route('/ddsc-office/getme').get(auth, main.getMe)

//Register
router.route('/ddsc-office/register').post( regis.CreateRegister )

//Login
router.route('/ddsc-office/login').post( login.loginController )

//TimeInOut
router.route('/ddsc-office/time').post( auth, time.timeIn )
router.route('/ddsc-office/gettime').get( authAdmin, time.getAll )
router.route('/ddsc-office/uptime/:id').put( authAdmin, time.updateTime )
router.route('/ddsc-office/deltime/:id').delete( authAdmin, time.deleteTime )



module.exports = router;