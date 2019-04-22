var router = require("express").Router();
var controller = require("../../controllers/configurations");
var auth = require("../auth");

router.post("/config", auth.required,  function(req, res, next) {
  controller.create(req, res, next);
});

module.exports = router;
