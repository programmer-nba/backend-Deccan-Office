const express = require('express');
const router = express.Router();
const Record = require('../../controllers/record_report/record_flow');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/record/flow/post', auth,Record.create);

router.get('/record/flow/byid/:id', auth, Record.getbyid);

router.get('/record/flow/getAll', auth, Record.getAll);

router.put('/record/flow/update/:id', auth, Record.update);

router.delete('/record/flow/del/:id', auth, Record.delend);

module.exports = router;