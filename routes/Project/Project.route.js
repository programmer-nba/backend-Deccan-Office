const express = require ('express')
const router =  express.Router();
const RequestProjectController = require ('../../controllers/RequestProject/Project.controller')

router.get('/getall', RequestProjectController.getRequestProject);

router.post('/insert', RequestProjectController.InsertRequestProject)



module.exports = router;