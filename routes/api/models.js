var mongoose = require("mongoose");
var router = require("express").Router();

var controller = require("../../controllers/models");

router.get("/castRate", auth.required, function(req, res, next) {
  controller.castRate(req, res, next);
});

module.exports = router;
