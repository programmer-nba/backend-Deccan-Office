const express = require('express');
const router = express.Router();
const SignatureController = require('../../controllers/Employees/signatureController') //สร้างตัวแปร รับฟังชั่นจากไฟล์ ExamType.controller

//Get all
router.get('/getall', SignatureController.getall);

//Insert
router.post('/insert', SignatureController.Insert);

//Get by ID
router.post('/getbyid/:id', SignatureController.getById);

module.exports = router;
