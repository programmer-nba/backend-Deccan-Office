const express = require('express');
const router = express.Router();
const LeaveController = require('../../controllers/Leave/Leave.controller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/getall',LeaveController.getAll);

router.get('/byid/:id',LeaveController.getByID);

router.post('/insert', LeaveController.InsertLeave);

router.put('/update/:id', LeaveController.Update);

router.delete('/delete/:id', LeaveController.Delete);

router.get('/sick/:Employees_id', LeaveController.calculateSick);

router.get('/businecss/:Employees_id', LeaveController.calculateBusinecss);

router.get('/maternity/:Employees_id', LeaveController.calculateMaternity)

module.exports = router;