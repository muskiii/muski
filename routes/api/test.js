var router = require("express").Router();
const NodeCache = require("node-cache");
const path = require("path");
const myCache = new NodeCache();
const fs = require("fs");
const key = "__express__";

var cacheEveryRequest = duration => {
  return (req, res, next) => {
    let cacheContent = myCache.get(key);
    if (cacheContent == null) {
      cacheContent = [];
    }
    if(req.body.id){
      cacheContent = cacheContent.filter(e => e.id != req.body.id);
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

router.get("/panic/:id", function(req, res, next) {
  let {id} = req.params;
  let testArray = myCache.get(key);
  let lastPosition = testArray.find(e => e.id = id);

  let data = fs.readFileSync(
    __dirname + "/../../public/testViewTemplate2.html",
    "utf-8"
  );

  let newIndex = data.replace(/REPLACELONG/g, parseFloat(lastPosition.longitude));
  newIndex = newIndex.replace(/REPLACELAT/g, parseFloat(lastPosition.latitude));
  newIndex = newIndex.replace(/REPLACENAME/g, lastPosition.userName);


  fs.unlink(__dirname + "/../../public/testView.html", err => {
    if (err) console.log(__dirname + "/../../public/testView.html");
    fs.writeFileSync(
      __dirname + "/../../public/testView.html",
      newIndex,
      "utf-8"
    );
    res.sendFile(path.join(__dirname + "/../../public/testView.html"));
  });
});

router.post("/", cacheEveryRequest(60));

module.exports = router;
