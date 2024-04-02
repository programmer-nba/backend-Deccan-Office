const express = require('express');
const router = express.Router();
const LeaveController = require('../../controllers/Leave/Leave.controller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/getall', /**authAdmin,**/ LeaveController.getAll);

router.get('/byid/:id', /**auth,**/ LeaveController.getByID);

router.post('/insert', /**auth,**/ LeaveController.InsertLeave);

router.put('/update/:id', /**authAdmin,**/ LeaveController.Update);

router.delete('/delete/:id', /**authAdmin,**/ LeaveController.Delete);

router.get('/sick/:Employees_id', /**auth,**/ LeaveController.calculateSick);

router.get('/businecss/:Employees_id', /**auth,**/ LeaveController.calculateBusinecss);

router.get('/maternity/:Employees_id', /**auth,**/ LeaveController.calculateMaternity)

module.exports = router;