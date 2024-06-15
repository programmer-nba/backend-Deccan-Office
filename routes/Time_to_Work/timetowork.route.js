const express = require('express');
const router = express.Router();
const TimeToWorkController = require('../../controllers/Employees/timeInOutController')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/time/morning/in', auth, TimeToWorkController.timeInMorning);

router.get('/time/getme', auth, TimeToWorkController.getMe)

router.put('/uptime/:id', auth, TimeToWorkController.updateTime)

router.delete('/deltime/:id', auth, TimeToWorkController.deleteTime)

router.get('/time/getday', auth, TimeToWorkController.getTimeDay)

router.post('/time/approve', auth, TimeToWorkController.approveTime)

router.get('/time/admin/getall', TimeToWorkController.getAll)

router.get('/time/getday/all', auth, TimeToWorkController.getTimeDayAll)// ดึงเวลาทั้งหมดของวันนี้

router.get('/time/getall/employee/:employee_id', auth, TimeToWorkController.getTimeByEmployee)// ดึงเวลาทั้งหมดตาม ID พนักงาน

router.get('/time/getall/ot', auth, TimeToWorkController.getAllOT)// ดึงข้อมูล OT ทั้งหมด

router.get('/time/getall/ot/byem/:employee_id', auth, TimeToWorkController.getOTByEmployeeId)// ดึงข้อมูล OT ทั้งหมดตามรหัสพนักงาน

router.get('/time/getall', auth, TimeToWorkController.getTimeAll)// ดึงข้อมูลทั้งหมด

router.post('/time/getall/employee',TimeToWorkController.getTimeAllEmployee)

router.put('/time/update/time',auth, TimeToWorkController.updateTimeEasy)

module.exports = router;