const express = require('express');
const router = express.Router();
const PartnerController = require('../../controllers/partners/partner');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/register',PartnerController.register);

router.post('/login/',PartnerController.login);

router.get('/me',PartnerController.me);

router.get('/', authAdmin,PartnerController.getall);

router.get('/byid/:id', auth, PartnerController.getbyid);

router.put('/:id', auth, PartnerController.edit);

router.delete('/:id', auth, PartnerController.delete);

router.put('/upLogo/:id', PartnerController.logo);

router.put('/updateStatus/:id', PartnerController.updateStatus);

router.put('/upIden/:id', PartnerController.iden);

router.put('/upCompany/:id', PartnerController.fileCompany);

router.put('/approve/:id', PartnerController.approve);

router.put('/wait/:id', PartnerController.waitStatus);

router.put('/addSignature/:id', PartnerController.addsignature);

router.put('/OTP/:id', PartnerController.OTP);

router.get('/request/product', PartnerController.requestProduct);

// router.put('/request/product/approve/:id', auth, PartnerController.approveproduct);

module.exports = router;