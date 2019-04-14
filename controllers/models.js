var mongoose = require("mongoose");
var Model = mongoose.model("Model");

exports.getById = function(req, res, next) {
  Model.findById(req.payload.id)
    .then(function(model) {
      if (!model) {
        return res.sendStatus(401);
      }
      return res.json({ model: model.toAuthJSON() });
    })
    .catch(next);
};

exports.get = function(req, res, next) {
  let query = {};
  let options = {};
  if (typeof req.query.filter !== "undefined") {
    let filter = JSON.parse(req.query.filter);
    let { id } = filter;
    if (id) query = { _id: { $in: id.map(id => mongoose.Types.ObjectId(id)) } };
  }
  if (typeof req.query.sort !== "undefined") {
    let sort = JSON.parse(req.query.sort);
    options.sort = {};
    options.sort[sort[0]] = sort[1] === "DESC" ? -1 : 1;
  }
  if (
    typeof req.query.limit !== "undefined" &&
    typeof req.query.skip !== "undefined"
  ) {
    options.offset = JSON.parse(req.query.skip);
    options.limit = JSON.parse(req.query.limit);
  }

  Model.paginate(query, options)
    .then(function(result) {
      res.setHeader(
        "Content-Range",
        `10 ${result.offset}-${result.offset + result.limit}/${result.total}`
      );
      return res.json(result.docs.map(model => model.toAuthJSONTEST()));
    })
    .catch(next);
};

exports.deletebyId = function(req, res, next) {
  let filter = JSON.parse(req.query.filter);
  let { id } = filter;
  if (id) query = { _id: { $in: id.map(id => mongoose.Types.ObjectId(id)) } };

  Model.deleteMany(query)
    .then(function(response) {
      if (!response.ok) {
        return res.sendStatus(401);
      }
      return res.status(200).json(id);
    })
    .catch(next);
};

exports.updateModel = function(req, res, next) {
  Model.findById(req.payload.id)
    .then(function(model) {
      if (!model) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.model.internalId !== "undefined") {
        model.internalId = req.body.model.internalId;
      }
      if (typeof req.body.model.value !== "undefined") {
        model.value = req.body.model.value;
      }
      if (typeof req.body.model.configuration !== "undefined") {
        model.configuration = req.body.model.configuration;
      }
      return model.save().then(function() {
        return res.json({ model: model.toAuthJSON() });
      });
    })
    .catch(next);
};


//This create only for internal testing
exports.create = function(req, res, next) {
  var model = new Model();
  model.internalId = req.body.model.internalId;
  model.value = req.body.model.value;
  model.configuration = req.body.model.configuration;
  model.totalRates = req.body.model.totalRates;

  model
    .save()
    .then(function() {
      return res.json({ model: model.toAuthJSON() });
    })
    .catch(next);
};

function rateDTO(rateBody){
  return {
      internalId: rateBody.internalId,
      value: rateBody.value,
      userId: rateBody.userId
    }
}

exports.castRate = function(req, res, next) {
  var rate = new rateDTO(req.body.rate);
  var model = Model.getById(rate.internalId);
  var user = User.getById(rate.userId);
  

  if (!model) {
    var model = new Model();
    model.internalId = rate.internalId;
    model.value = rate.value;
    model.totalRates = 1;
    model.configuration = user.configuration;
    model.save();
  }
  else {
    model.value = (model.value + rate.value) / (model.totalRates + 1);
    model.totalRates += 1;
    model.save();
  }
};
