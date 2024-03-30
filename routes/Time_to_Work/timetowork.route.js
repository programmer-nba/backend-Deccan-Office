const express = require('express');
const router = express.Router();
const TimeToWorkController = require('../../controllers/Employees/timeInOutController')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/time/morning/in',auth,TimeToWorkController.timeInMorning);

router.get('/time/getme',auth,TimeToWorkController.getMe)

router.put('/uptime/:id',authAdmin,TimeToWorkController.updateTime)

router.delete('/deltime/:id',authAdmin,TimeToWorkController.deleteTime)

router.get('/time/getday',auth,TimeToWorkController.getTimeDay)

module.exports = router;