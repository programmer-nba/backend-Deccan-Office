const express = require ('express')
const router =  express.Router();
const RequestProjectController = require ('../../controllers/project/Project.controller')

router.get('/getall', RequestProjectController.getRequestProject);

router.post('/insert/project', RequestProjectController.InsertRequestProject)



module.exports = router;