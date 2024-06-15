const express = require('express');
const router = express.Router();
const updateTime = require('../../controllers/Employees/requestTime')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/time/create', auth, updateTime.create);

router.get('/time/getAll', auth, updateTime.getAll)

router.put('/time/uptime/:id', auth, updateTime.update)

router.delete('/time/deltime/:id', auth, updateTime.delend)

router.get('/time/get/:id', auth, updateTime.getById)

module.exports = router;