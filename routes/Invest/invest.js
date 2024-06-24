const router = require("express").Router();
const invest = require("../../controllers/Invest/Invest.shop.controller");
const auth = require("../../lib/auth");

router.get("/", invest.getInvestAll);
router.get("/:id", invest.getInvestById);

// อนุมัติ
router.post("/approve/:id", auth, invest.approve);
router.post("/cancel/:id", auth, invest.cancel);

module.exports = router;