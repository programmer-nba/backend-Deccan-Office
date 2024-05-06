const express = require('express');
const router = express.Router();
const SubProjectTypeController = require('../../controllers/ProjectType/SubType.controller');

// สร้างประเภทงานใหม่
router.post('/insert', SubProjectTypeController.InsertSubType );

// แก้ไขข้อมูลประเภทงาน
router.put('/update/:id',SubProjectTypeController.updateType );

// ลบประเภทงาน
router.delete('/delete/:id',SubProjectTypeController.deleteType );

// ดึงข้อมูลประเภทงานทั้งหมด
router.get('/getall',SubProjectTypeController.getSubTypes );

//ดึงข้อมูลตามประเภทหลัก
router.get('/getall/:min_type',SubProjectTypeController.getSubTypesByMain );

module.exports = router;