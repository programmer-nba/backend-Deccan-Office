const express = require('express');
const router = express.Router();
const SignatureController = require('../../controllers/Employees/signatureController') //สร้างตัวแปร รับฟังชั่นจากไฟล์ ExamType.controller
const authUser = require("../../auten")

//Get all
router.get('/getall', SignatureController.getall);

//Insert
router.post('/insert', authUser.user, SignatureController.Insert);

//Get by ID
router.post('/getbyid/:id', SignatureController.getById);

//Update
router.put('/update/:id', SignatureController.Update);

//Delete
router.post('/delete/:id', SignatureController.Delete);

module.exports = router;
