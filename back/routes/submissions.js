const submissions = require("../controllers/submissions.controller.js");
var express = require('express');
var router = express.Router();

router.get("/unpaid", submissions.findAllUnpaid);
router.post("/:submission_id/pay", submissions.paySubmission);

module.exports = router;