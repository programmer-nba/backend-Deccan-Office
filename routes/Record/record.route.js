const express = require('express');
const router = express.Router();
const Record = require('../../controllers/record_report/record');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/record/post', auth,Record.create);

router.get('/record/byid/:user_id', auth, Record.getbyid);

router.get('/record/getAll', authAdmin, Record.getAll);

router.put('/record/update/:id', authAdmin, Record.update);

router.delete('/record/del/:id', authAdmin, Record.delend);

module.exports = router;