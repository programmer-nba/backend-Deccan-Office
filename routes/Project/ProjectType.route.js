const express = require('express');
const router = express.Router();
const ProjectTypeController = require('../../controllers/project/ProjectType.controller');

// สร้างประเภทงานใหม่
router.post('/', ProjectTypeController.createType );

// แก้ไขข้อมูลประเภทงาน
router.put('/:id',ProjectTypeController.updateType );

// ลบประเภทงาน
router.delete('/:id',ProjectTypeController.deleteType );

// ดึงข้อมูลประเภทงานทั้งหมด
router.get('/',ProjectTypeController.getTypes );

module.exports = router;