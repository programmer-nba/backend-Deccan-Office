const express = require('express');
const router = express.Router();
const Record = require('../../controllers/record_report/record_type');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/record/type/post', auth,Record.create);

router.get('/record/type/byid/:id', auth, Record.getbyid);

router.get('/record/type/getAll', auth, Record.getAll);

router.put('/record/type/update/:id', auth, Record.update);

router.delete('/record/type/del/:id', auth, Record.delend);

module.exports = router;