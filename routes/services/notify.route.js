const express = require('express');
const router = express.Router();
const NotifyController = require('../../controllers/Admin/notify.controller');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/create', NotifyController.createNotifyToken);
router.get('/all', NotifyController.getNotifyTokens);
router.post('/send', NotifyController.sendNotification);

module.exports = router;