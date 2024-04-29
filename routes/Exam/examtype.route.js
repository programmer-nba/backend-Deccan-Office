const express = require('express');
const router = express.Router();
const ExamTypeController = require('../../controllers/Exam/ExamType.controller.js') //สร้างตัวแปร รับฟังชั่นจากไฟล์ ExamType.controller

//Get ExamType
router.get('/', ExamTypeController.getExamType);
//ใช้โมดูล router และ เมธอด get กำหนดไปที่ path /exam-type จากนั้นเรียกใช้ function getExamType จากตัวแปร ExamTypeController

//Get ExamType By Id
router.get('/get-examtype-byid/:id',ExamTypeController.getExamTypeById);
//ใช้โมดูล router และ เมธอด get กำหนดไปที่ path /exam-type/get-examtype-byid/ จะรับ id โดย :id จากนั้นเรียกใช้ฟังชั่น getExamTypeById จากตัวแปร ExamTypeController

//Insert ExamType
router.post('/insert-exam-type', ExamTypeController.InsertExamType);
//ใช้โมดูล router และ เมธอด post กำหนดไปที่ path /exam-type/insert-exam-type จากนั้นเรียกใช้ function InsertExamType จากตัวแปร ExamTypeController

//Update ExamType
router.put('/update-exam-type/:id',ExamTypeController.UpdateExamType);
//ใช้โมดูล router และ เมธอด put กำหนดไปที่ path /exam-type/update-exam-type จะรับ id โดย :id จากนั้นเรียกใช้ function UpdateExamType จากตัวแปร ExamTypeController

router.delete('/delete-exam-type/:id', ExamTypeController.DeleteExamType);
//ใช้โมดูล router และ เมธอด delete กำหนดไปที่ path /exam-type/delete-exam-type จะรับ id โดย :id จากนั้นเรียกใช้ function DeleteExam จากตัวแปร ExamController

module.exports = router;
