const express = require('express');
const router = express.Router();
const TermsController = require('../../controllers/Terms/terms.controller');
const PdfController = require('../../controllers/Terms/pdf.controller')

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

router.post("/pdf/upload", PdfController.upload, PdfController.uploadPdf)
router.put("/pdf/edit", PdfController.updatePdf)
router.get("/pdf/download/:filename", PdfController.getPdf)

module.exports = router;