const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const ExamController = require('../../controllers/Exam/Exams.controller') //สร้างตัวแปร รับฟังชั่นจากไฟล์ Exams.controller.js

//Get Exam
router.get('/', ExamController.getExam);
//ใช้โมดูล router และ เมธอด get กำหนดไปที่ path exam/ จากนั้นเรียกใช้ function getExam จากตัวแปร ExamController

//Get Exam By Id
router.get('/byid/:id', ExamController.getExamById);
//ใช้โมดูล router และ เมธอด get กำหนดไปที่ path exam/byid/ จะรับ id โดย :id จากนั้นเรียกใช้ฟังชั่น getExamById จากตัวแปร ExamController

//Insert Exam
router.post('/insert-exam', ExamController.InsertExam);
//ใช้โมดูล router และ เมธอด post กำหนดไปที่ path exam/insert-exam จากนั้นเรียกใช้ function InsertExam จากตัวแปร ExamController

//Update Exam
router.put('/update-exam/:id', ExamController.UpdateExam);
//ใช้โมดูล router และ เมธอด put กำหนดไปที่ path /update-exam จากนั้นเรียกใช้ function UpdateExam จากตัวแปร ExamController

router.delete('/delete-exam/:id', ExamController.DeleteExam);
//ใช้โมดูล router และ เมธอด delete กำหนดไปที่ path /delete-exam จากนั้นเรียกใช้ function DeleteExam จากตัวแปร ExamController

module.exports = router;
