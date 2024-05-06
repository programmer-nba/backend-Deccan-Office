const express = require('express');
const router = express.Router();
const TermsController = require('../../controllers/Terms/terms.controller');

router.post("/create", TermsController.create)
router.put("/:id", TermsController.update)
router.get("/all", TermsController.getAll)
router.get("/:id", TermsController.getOne)
router.delete("/:id", TermsController.deleteOne)

module.exports = router;