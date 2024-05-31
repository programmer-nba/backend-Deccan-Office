const express = require('express');
const router = express.Router();
const TermsController = require('../../controllers/Terms/terms.controller');

router.post("/create", TermsController.create)
router.put("/:id", TermsController.update)
router.get("/all", TermsController.getAll)
router.get("/:id/term", TermsController.getOne)
router.get("/:code/all", TermsController.getAllStandardByCode)
router.get("/:code/one", TermsController.getOneStandardByCode)
router.delete("/:id", TermsController.deleteOne)

router.post("/accepted", TermsController.createAcceptedTerm)
router.get("/accepteds", TermsController.getAcceptedTerms)

router.get("/:id/userterms", TermsController.getUserAcceptedTerms)

module.exports = router;