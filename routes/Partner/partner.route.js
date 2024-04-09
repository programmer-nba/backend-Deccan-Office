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

router.put('/requestproduct/approve/:id',auth , PartnerController.approveproduct);

router.put('/requestproduct/unapprove/:id', auth, PartnerController.unapproveproduct);

router.put('/requestproduct/editproduct/:id', auth, PartnerController.Editproduct);

router.get('/requestshop/waitapprove', PartnerController.requestShop);

router.get('/requestshop/getall/', PartnerController.GetAllShop);

router.put('/requestshop/approve/:id', auth, PartnerController.ApproveRequestShop);

router.put('/requestshop/unapprove/:id', auth, PartnerController.UnApproveRequestShop);

module.exports = router;