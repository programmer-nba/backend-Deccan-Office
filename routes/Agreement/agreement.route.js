const express = require('express');
const router = express.Router();
const AgreementController = require('../../controllers/Agreement/Agreement.controller')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");
const authUser = require("../../auten")

//Get Agreement
router.get('/getall', authAdmin, AgreementController.getallAgreement);
//Get By me
router.get('/byme', authUser.user, AgreementController.getallAgreementByme);

//Insert Agreement
router.post('/insert', authAdmin, AgreementController.InsertAgreement);

router.put('/update/:id', authAdmin, AgreementController.updateAgreement); //Update Agreement
router.put('/user/confirm/:id', authUser.user, AgreementController.Userconfirm); //User confirm

//Delete Agreement
router.delete('/delete/:id', authAdmin, AgreementController.DeleteAgreement);

module.exports = router;