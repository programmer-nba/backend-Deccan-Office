const express = require('express');
const router = express.Router();
const DraftDocumentController = require('../../controllers/Document/DraftDocument.Controller')

//Get Draft Document
router.get('/getall', DraftDocumentController.getallDraftDocument);

//Insert Draft Document
router.post('/insert', DraftDocumentController.InsertDraftDocument)



module.exports = router;