var router = require("express").Router();
var auth = require("../auth");
var controller = require("../../controllers/users");

router.get("/users", auth.required, function(req, res, next) {
  controller.getById(req, res, next);
});

router.delete("/users", function(req, res, next) {
  controller.deletebyId(req, res, next);
});

router.put("/users", auth.required, function(req, res, next) {
  controller.updateUser(req, res, next);
});

router.post("/users", function(req, res, next) {
  controller.create(req, res, next);
});

router.post("/users/login", function(req, res, next) {
  controller.login(req, res, next);
});

//---test---//
router.get("/users/all", auth.optional, function(req, res, next) {
  controller.get(req, res, next);
});
//---test---//

module.exports = router;
