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
router.delete("/", function(req, res, next) {
  return res.json(myCache.set(key, [], 60 * 1000));
});
router.get("/", function(req, res, next) {
  return res.json(myCache.get(key));
});
router.post("/", cacheMiddleware(60));

module.exports = router;
