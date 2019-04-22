var mongoose = require("mongoose");
var Entity = mongoose.model("Entity");
var User = mongoose.model("User");
var Configuration = mongoose.model("Configuration");

exports.getById = function(req, res, next) {
  Entity.findById(req.payload.id)
    .then(function(entity) {
      if (!entity) {
        return res.sendStatus(500);
      }
      return res.json({ entity: entity.toAuthJSON() });
    })
    .catch(next);
};
exports.getByInternalId = function(req, res, next) {
  let {internalId} = req.params;
  Entity.findOne({internalId:internalId})
  .populate("configuration")
  .exec(function(error, entity) {
    if (!entity) return res.sendStatus(500);

    return res.json({ entity: entity.toDTO() });
  });
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

  Entity.paginate(query, options)
    .then(function(result) {
      res.setHeader(
        "Content-Range",
        `10 ${result.offset}-${result.offset + result.limit}/${result.total}`
      );
      return res.json(result.docs.map(entity => entity.toAuthJSONTEST()));
    })
    .catch(next);
};

exports.deletebyId = function(req, res, next) {
  let filter = JSON.parse(req.query.filter);
  let { id } = filter;
  if (id) query = { _id: { $in: id.map(id => mongoose.Types.ObjectId(id)) } };

  Entity.deleteMany(query)
    .then(function(response) {
      if (!response.ok) {
        return res.sendStatus(500);
      }
      return res.status(200).json(id);
    })
    .catch(next);
};

exports.create = function(req, res, next) {
  let { internalId, name } = req.body.entity;
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) return res.sendStatus(500);

      Configuration.findOne({ user: user._id, name })
        .then(function(config) {
          if (!config) return res.sendStatus(500);

          var newEntity = new Entity({
            internalId,
            totalRates: 0,
            configuration:config._id,
            rates:{},
            rate: 0
          });
          for (let index = 1; index <= config.scale ; index++) {
            newEntity.rates.set(index.toString(), 0);
          };

          newEntity
            .save()
            .then(function(err) {
              Entity.findById(newEntity.id)
                .populate("configuration")
                .exec(function(error, entity) {
                  if (!entity) return res.sendStatus(500);

                  return res.json({ entity: entity.toDTO() });
                });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};

exports.rate = function(req, res, next) {
  var { value, internalId, comment } = req.body.entity;
  User.findById(req.payload.id)
    .then(function(user) {
      if (!user) return res.sendStatus(500);

      Entity.findOne({ internalId })
        .then(function(entity) {
          if (!entity) return res.sendStatus(500);

          entity.comments.push(comment);
          entity.addNewRate(value);
          entity.calculateRate(value);          
          entity
            .save()
            .then(function(err) {
              Entity.findById(entity.id)
                // .populate("configuration")
                .exec(function(error, entity) {
                  if (!entity) return res.sendStatus(500);

                  return res.json({ entity: entity.toDTO() });
                });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
};