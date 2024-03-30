const express = require('express');
const router = express.Router();
const Record = require('../../controllers/record_report/record');

//Auth
const auth = require("../../lib/auth");
const authAdmin = require("../../lib/authAdmin");

router.post('/record/post',Record.create);

router.get('/record/getAll',Record.getAll);

router.put('/record/update/:id',Record.update);

router.delete('/record/del/:id',Record.delend);

module.exports = router;