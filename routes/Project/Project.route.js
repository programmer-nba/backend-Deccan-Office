const express = require ('express')
const router =  express.Router();
const RequestProjectController = require ('../../controllers/RequestProject/Project.controller')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.get('/getall', RequestProjectController.getRequestProject);

router.get('/getbyme', auth, RequestProjectController.getProjectType);

router.post('/insert', RequestProjectController.InsertRequestProject);

router.put('/accept/:id', auth, RequestProjectController.Accept);


module.exports = router;