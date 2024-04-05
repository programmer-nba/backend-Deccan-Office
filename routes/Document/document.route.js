const express = require('express');
const router = express.Router();
const DocumentController = require('../../controllers/Document/document.Coltroller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

//Get
router.get('/getall', DocumentController.getdocument);
router.get('/byid/:id', DocumentController.getdocumentById);
router.get('/bystatus/:Status', DocumentController.getdocumentByStatus);
router.get('/byreq/:employee_id', DocumentController.getdocumentByRequester);
router.get('/byMe', auth, DocumentController.getdocumentByMe);

//Post
router.post('/insert', auth,DocumentController.InsertDocument); // เพิ่ม Document
router.post('/add/detail/:id',DocumentController.addDetailToDocument); //เพิ่ม detail ใน Document

//Update
router.put('/update/:id',DocumentController.UpdateDocument);// แก้ไข Document
router.put('/update/:id/detail/:detailId',DocumentController.updateDocumentDetail);// แก้ไขเฉพาะ Detail ของ Decument
router.put('/update/:id/head_department', authAdmin, DocumentController.updateDocumentHeadDepartment);//แก้ไขเฉพาะ Head_Department
router.put('/update/:id/manager', authAdmin, DocumentController.updateDocumentManager);//แก้ไขเฉพาะ manager
router.put('/update/:id/ceo', authAdmin, DocumentController.updateDocumentCEO);// CEO อนุมัติ
router.put('/update/:id/ceo/no', authAdmin, DocumentController.updateDocumentCEONotAllow);

//delete
router.delete('/delete/:id',DocumentController.DeleteDocument); //ลบ Document
router.put('/delete/:id/detail/:detailId',DocumentController.DeleteDetail);//ลบเฉพาะ Detail




module.exports = router;