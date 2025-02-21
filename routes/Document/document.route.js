const express = require('express');
const router = express.Router();
const DocumentController = require('../../controllers/Document/document.Coltroller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

//Get
router.get('/getall', DocumentController.getdocument); // http://localhost:9996/ddsc-office/document/getAll
router.get('/getuserid/:id' ,DocumentController.GetDocumentByID ); // http://localhost:9996/ddsc-office/document/GetUserID/00005

router.get('/byid/:id', DocumentController.getdocumentById); // 

router.get('/bystatus/:Status_document', DocumentController.getdocumentByStatus);
router.get('/byreq/:employee_id', DocumentController.getdocumentByRequester);
router.get('/byMe', auth, DocumentController.getdocumentByMe);
router.get('/approve/byMe', auth, DocumentController.getDocumentApproveByMe);

//Post
router.post('/insert', auth,DocumentController.InsertDocument); // เพิ่ม Document
router.post('/add/file/:id',DocumentController.addfileToDocument); //เพิ่ม detail ใน Document

//Update
router.put('/update/:id',auth ,DocumentController.UpdateDocument);// แก้ไข Document
router.put('/del/file/:id',DocumentController.DeleteFile); //ลบ 
router.put('/updatebyid/:id' , DocumentController.UpdateUserByID); // Update User document  

//delete
router.delete('/delete/:id',DocumentController.DeleteDocument); //ลบ Document

module.exports = router;