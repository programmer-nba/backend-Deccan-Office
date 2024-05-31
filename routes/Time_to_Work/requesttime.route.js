const express = require('express');
const router = express.Router();
const updateTime = require('../../controllers/Employees/requestTime')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/time/create', authAdmin, updateTime.create);

router.get('/time/getAll', authAdmin, updateTime.getAll)

router.put('/time/uptime/:id', authAdmin, updateTime.update)

router.delete('/time/deltime/:id', authAdmin, updateTime.delend)

router.get('/time/get/:id', authAdmin, updateTime.getById)

module.exports = router;