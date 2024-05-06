const express = require('express');
const router = express.Router();
const ProjectTypeController = require('../../controllers/ProjectType/ProjectType.controller');

// สร้างประเภทงานใหม่
router.post('/add', ProjectTypeController.createType );

// แก้ไขข้อมูลประเภทงาน
router.put('/update/:id',ProjectTypeController.updateType );

// ลบประเภทงาน
router.delete('/delete/:id',ProjectTypeController.deleteType );

// ดึงข้อมูลประเภทงานทั้งหมด
router.get('/getall',ProjectTypeController.getTypes );

module.exports = router;