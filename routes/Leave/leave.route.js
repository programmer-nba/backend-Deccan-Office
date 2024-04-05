const express = require('express');
const router = express.Router();
const LeaveController = require('../../controllers/Leave/Leave.controller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/getall', /**authAdmin,**/ LeaveController.getAll); //ดึงข้อมูลทั้งหมด
router.get('/byid/:id', /**auth,**/ LeaveController.getByID); //ดึงข้อมูลตาม id ใบลา
router.get('/byem/:Employees_id',LeaveController.getByEmID); //ดึงข้อมูลผู้ใช้
router.get('/byyear/:date', LeaveController.getByYear); //ดึงข้อมูลทั้งหมดตามปี
router.get('/byem/:Employees_id/year/:date', LeaveController.getByEmployeeIdAndYear) //ดึงข้อมูลตามปีของผู้ใช้คนนั้น

router.post('/insert', auth, LeaveController.InsertLeave); //เพิ่มข้อมูลใบลา

router.put('/update/:id', /**authAdmin,**/ LeaveController.Update);

router.delete('/delete/:id', /**authAdmin,**/ LeaveController.Delete);

router.get('/sick/:Employees_id', /**auth,**/ LeaveController.calculateSick);// คำนวนจำนวนการลาป่วยตามผู้ใช้
router.get('/businecss/:Employees_id', /**auth,**/ LeaveController.calculateBusinecss);// คำนวนจำนวนการลาป่ายตามผู้ใช้
router.get('/maternity/:Employees_id', /**auth,**/ LeaveController.calculateMaternity);// คำนวนจำนวนการลาป่ายตามผู้ใช้ 56.52
router.get('/ordination/:Employees_id', LeaveController.calculateOrdination);// คำนวณจำนวนวันลาบวช

module.exports = router;