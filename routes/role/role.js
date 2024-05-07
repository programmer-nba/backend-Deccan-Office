const express = require('express');
const router = express.Router();
const Role = require('../../controllers/Employees/role')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/role/create',auth,Role.create);

router.get('/geall',Role.getall);

module.exports = router;