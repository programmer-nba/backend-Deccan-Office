const express = require('express');
const router = express.Router();
const AgreementController = require('../../controllers/Agreement/Agreement.controller')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

//Get Agreement
router.get('/getall', authAdmin, AgreementController.getallAgreement);

//Insert Agreement
router.post('/insert', authAdmin, AgreementController.InsertAgreement);

//Update Agreement
router.put('/update/:id', authAdmin, AgreementController.updateAgreement);

//Delete Agreement
router.delete('/delete/:id', authAdmin, AgreementController.DeleteAgreement);



module.exports = router;