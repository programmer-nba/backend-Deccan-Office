const express = require('express');
const router = express.Router();
const Role = require('../../controllers/Employees/role')

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/create',auth,Role.create);
router.get('/getall',auth, Role.getall);
router.put('/update/:id',auth, Role.updateRole);
router.delete('/delete/:id',auth, Role.deleteRole);
router.post('/getrole',auth, Role.getPosition);

module.exports = router;