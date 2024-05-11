const express = require('express');
const router = express.Router();
const AdminController = require('../../controllers/Admin/admin.controller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.put('/partner/confirm/:id', authAdmin, AdminController.confirmPartner);

router.put('/partner/cancel/:id', authAdmin, AdminController.cancelPartner);

router.post('/notify', AdminController.sendNotification);

module.exports = router;