const express = require('express');
const router = express.Router();
const DraftDocumentController = require('../../controllers/Document/DraftDocument.Controller')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

//Get Draft Document
router.get('/getall', DraftDocumentController.getallDraftDocument);

//Get Draft By Me
router.get('/get/byme', auth, DraftDocumentController.getdraftByMe)

//Insert Draft Document
router.post('/insert', auth, DraftDocumentController.InsertDraftDocument);

//Update Draft Document
router.put('/update/:id', DraftDocumentController.UpdateDraftDocument);

//Delete Draft Document
router.delete('/delete/:id', DraftDocumentController.DeleteDraftDocument);

module.exports = router;