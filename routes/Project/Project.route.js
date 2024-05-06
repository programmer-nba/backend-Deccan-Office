const express = require ('express')
const router =  express.Router();
const RequestProjectController = require ('../../controllers/RequestProject/Project.controller')

router.get('/getall', RequestProjectController.getRequestProject);

router.post('/insert', RequestProjectController.InsertRequestProject);

router.put('/accept/:id', RequestProjectController.Accept);

module.exports = router;