const router = require('express').Router();
const main = require('../controllers/employeeController');
const regis = require('../controllers/registerController');
const login = require('../controllers/loginController');

//CRUD
router.route('/ddsc-office/post').post(main.Post) //ใช้กำหนด path ที่ต้องการทำให้ไม่ต้องไปประกาศใน File Server แล้ว
router.route('/ddsc-office/get').get(main.getAll)
router.route('/ddsc-office/getid').get(main.getByID)
router.route('/ddsc-office/update/:id').put(main.Update)
router.route('/ddsc-office/del/:id').delete(main.Delete)

//Register
router.route('/ddsc-office/register').post(regis.CreateRegister)

//Login
router.route('/ddsc-office/login').post(login.loginController)


module.exports = router;