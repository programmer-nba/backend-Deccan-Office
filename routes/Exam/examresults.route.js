const express = require('express');
const router = express.Router();
const ExamResultsController = require('../../controllers/Exam/ExamResults.controller')

//Get ExamResults
router.get('/', ExamResultsController.getExamResults);


//Get ExamResults By Id
router.get('/byid/:id', ExamResultsController.getExamResultsById);


//Insert ExamResults
router.post('/insert-examresults', ExamResultsController.InsertExamResults);


//Update ExamResults
router.put('/update-examresults/:id', ExamResultsController.UpdateExamResults);


router.put('/update-examresults/userid/:User_id', ExamResultsController.UpdateExamResultsByID);


//Delete ExamResults
router.delete('/delete-examsults/:id', ExamResultsController.DeleteExamResults);


module.exports = router;
