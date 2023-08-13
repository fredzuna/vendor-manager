const admin = require("../controllers/admin.controller.js");
var express = require('express');
var router = express.Router();

router.get("/best-supplier-profession", admin.bestSupplierProfession);
router.get("/best-buyers", admin.bestBuyers);

module.exports = router;