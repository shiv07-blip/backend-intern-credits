const express = require("express");
const { resetCredit, deductCreditsByUserId, addCreditsByUserId, getCreditById } = require("../controllers/creditsController");
const router = express.Router();

router.get("/:user_id", getCreditById);
router.post("/:user_id/add", addCreditsByUserId);
router.post("/:user_id/deduct", deductCreditsByUserId);
router.patch("/:user_id/reset", resetCredit);

module.exports = router;
