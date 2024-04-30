const express = require('express');
const router = express.Router();
const LeaveTypeController = require('../../controllers/Leave/LeaveType.controller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/getall', LeaveTypeController.getLeaveType); //ดึงข้อมูลทั้งหมด

router.get('/byid/:id', LeaveTypeController.getLeaveTypeById);

router.post('/insert', LeaveTypeController.InsertLeaveType);

router.put('/update', LeaveTypeController.UpdateLeaveType);

router.delete('/delete', LeaveTypeController.DeleteLeaveType);

module.exports = router;