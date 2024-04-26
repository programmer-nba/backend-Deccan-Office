const express = require('express');
const router = express.Router();
const DraftDocumentController = require('../../controllers/Document/DraftDocument.Controller')

//Get Draft Document
router.get('/getall', DraftDocumentController.getallDraftDocument);

//Insert Draft Document
router.post('/insert', DraftDocumentController.InsertDraftDocument);

//Update Draft Document
router.put('/update/:id', DraftDocumentController.UpdateDraftDocument);

//Delete Draft Document
router.delete('/delete/:id', DraftDocumentController.DeleteDraftDocument);

module.exports = router;