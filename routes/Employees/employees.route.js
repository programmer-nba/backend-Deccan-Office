const express = require('express');
const router = express.Router();
const EmployeesController = require('../../controllers/Employees/employeeController');
const LoginController = require('../../controllers/Employees/loginController');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/get',auth,EmployeesController.getAll);

router.get('/getid/:id',auth,EmployeesController.getByID);

router.get('/getme',auth,EmployeesController.getMe);

router.get('/get/member',auth,EmployeesController.getMember);

router.post('/post',authAdmin,EmployeesController.Post);

router.put('/update/:id',auth,EmployeesController.Update);

router.delete('/del/:id',authAdmin,EmployeesController.Delete);

router.post('/login',LoginController.loginController);

router.put('/employee/upload/image/:id', auth, EmployeesController.UpdateImage);

router.put('/token/:id', EmployeesController.Update_token);

module.exports = router;