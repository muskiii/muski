var mongoose = require("mongoose");
var Configuration = mongoose.model("Configuration");
var User = mongoose.model("User");

exports.getById = function(req, res, next) {
  Configuration.findById(req.payload.id)
    .then(function(conf) {
      if (!conf) {
        return res.sendStatus(401);
      }
      return res.json({ conf: conf.toAuthJSON() });
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

  Configuration.paginate(query, options)
    .then(function(result) {
      res.setHeader(
        "Content-Range",
        `10 ${result.offset}-${result.offset + result.limit}/${result.total}`
      );
      return res.json(result.docs.map(conf => conf.toAuthJSONTEST()));
    })
    .catch(next);
};

exports.deletebyId = function(req, res, next) {
  let filter = JSON.parse(req.query.filter);
  let { id } = filter;
  if (id) query = { _id: { $in: id.map(id => mongoose.Types.ObjectId(id)) } };

  Configuration.deleteMany(query)
    .then(function(response) {
      if (!response.ok) {
        return res.sendStatus(401);
      }
      return res.status(200).json(id);
    })
    .catch(next);
};

exports.updateConfiguration = function(req, res, next) {
  Configuration.findById(req.payload.id)
    .then(function(conf) {
      if (!conf) {
        return res.sendStatus(401);
      }

      // only update fields that were actually passed...
      if (typeof req.body.conf.name !== "undefined") {
        conf.name = req.body.conf.name;
      }
      if (typeof req.body.conf.minRate !== "undefined") {
        conf.minRate = req.body.conf.maxRate;
      }
      if (typeof req.body.conf.maxRate !== "undefined") {
        conf.maxRate = req.body.conf.maxRate;
      }

      return conf.save().then(function() {
        return res.json({ conf: conf.toAuthJSON() });
      });
    })
    .catch(next);
};

exports.create = function(req, res, next) {
  let {name, untilRank, scale} = req.body.config;
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) return res.sendStatus(401);
      var config = new Configuration();
      config.name = name;
      config.untilRank = untilRank;
      config.scale = scale;
      config.user = user._id;
      config
        .save()
        .then(function(err) {
          Configuration.findById(config.id)
            // .populate("user")
            .exec(function(error, configuration) {
              return res.json({ configuration: configuration.toDTO() });
            });
        })
        .catch(next);
    })
    .catch(next);
};