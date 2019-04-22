var router = require("express").Router();
var controller = require("../../controllers/Entities");
var auth = require("../auth");
// params (req, res, next)
router.post("/rate", auth.required, controller.create);
router.put("/rate", auth.required, controller.rate);
router.get("/rate/:internalId", controller.getByInternalId);

module.exports = router;
