var router = require("express").Router();
const NodeCache = require("node-cache");
const myCache = new NodeCache();
const key = "__express__";

var cacheMiddleware = duration => {
  return (req, res, next) => {
    let cacheContent = myCache.get(key);
    if (cacheContent == null) {
      cacheContent = [];
    }
    cacheContent.push(req.body);
    myCache.set(key, cacheContent, duration * 1000);
    res.json(req.body);
  };
};
router.get("/", function(req, res, next) {
  return res.json(myCache.get(key));
});
router.post("/", cacheMiddleware(600));

module.exports = router;
