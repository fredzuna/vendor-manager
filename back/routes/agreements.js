const agreements = require("../controllers/agreements.controller.js");
var express = require('express');
var router = express.Router();

router.get("/:id", agreements.findOne);
router.get("/", agreements.findAll);

module.exports = router;