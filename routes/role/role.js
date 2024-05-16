const express = require('express');
const router = express.Router();
const Role = require('../../controllers/Employees/role')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/create',auth,Role.create);
router.get('/getall',Role.getall);
router.put('/update',Role.updateRole);
router.delete('/delete',Role.deleteRole);

module.exports = router;