const express = require('express');
const router = express.Router();
const DocumentController = require('../../controllers/Document/document.Coltroller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

//Get
router.get('/getall', DocumentController.getdocument);
router.get('/byid/:id', DocumentController.getdocumentById);
router.get('/bystatus/:Status_document', DocumentController.getdocumentByStatus);
router.get('/byreq/:employee_id', DocumentController.getdocumentByRequester);
router.get('/byMe', auth, DocumentController.getdocumentByMe);
router.get('/approve/byMe', auth, DocumentController.getDocumentApproveByMe);

//Post
router.post('/insert', auth,DocumentController.InsertDocument); // เพิ่ม Document
router.post('/add/detail/:id',DocumentController.addDetailToDocument); //เพิ่ม detail ใน Document

//Update
router.put('/update/:id',auth ,DocumentController.UpdateDocument);// แก้ไข Document

router.put('/update/status/:id', authAdmin, DocumentController.updateDocumentStatus)

//delete
router.delete('/delete/:id',DocumentController.DeleteDocument); //ลบ Document





module.exports = router;