const express = require('express');
const router = express.Router();
const onestopserviceController = require('../../controllers/Tossagunshop/onestopservice.controller');
const auth = require('../../lib/auth');

//ดึงข้อมูล one stop service ทั้งหมด
router.get('/',auth, onestopserviceController.getOneStopService);

//ดึงข้อมูล one stop service ตาม id
router.get('/byid/:id',auth, onestopserviceController.getOneStopServiceById);

//แก้ไขข้อมูล one stop service ตาม id
router.put('/:id',auth, onestopserviceController.updateOneStopService);

//อนุมัติ one stop service
router.put('/approve/:id',auth, onestopserviceController.approveOneStopService);


//พนักงาน
//ดึงข้อมูลพนักงาน by shop id
router.get('/employee/:shopid',auth, onestopserviceController.getEmployeeByShopId);

module.exports = router;