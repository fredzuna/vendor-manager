const balances = require("../controllers/balances.controller.js");
var express = require('express');
var router = express.Router();

router.post("/deposit/:accountId", balances.depositBalance);

module.exports = router;