var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var auth = require('../auth');

router.get('/user', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

//---test---//
router.get('/users', auth.optional, function (req, res, next) {
  let query = {};
  let options = {}
  if (typeof req.query.filter !== 'undefined') {
    let filter  = JSON.parse(req.query.filter);
    let {id} = filter;
    if (id) query = {'_id': { $in: id.map(id=>mongoose.Types.ObjectId(id))}}
    // query = {
    //   '_id': { $in: [
    //       mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
    //       mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
    //       mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
    //   ]}
    // query = filter;
    debugger;
  }
  if (typeof req.query.sort !== 'undefined') {
    let sort = JSON.parse(req.query.sort);
    options.sort = {}
    options.sort[sort[0]] = sort[1] === "DESC" ? -1 : 1;
  }
  if (typeof req.query.limit !== 'undefined' && typeof req.query.skip !== 'undefined') {
    options.offset = JSON.parse(req.query.skip);
    options.limit = JSON.parse(req.query.limit);
  }

  User.paginate(query,options).then(function (result) {
    res.setHeader("Content-Range", `10 ${result.offset}-${result.offset + result.limit}/${result.total}`);
    return res.json(result.docs.map(user => user.toAuthJSONTEST()));
  }).catch(next);
});

router.get('/config', auth.optional, function (req, res, next) {
  let query = {};
  let options = {}
  if (typeof req.query.filter !== 'undefined') {
    let filter  = JSON.parse(req.query.filter);
    let {id} = filter;
    if (id) query = {'_id': { $in: id.map(id=>mongoose.Types.ObjectId(id))}}
    // query = {
    //   '_id': { $in: [
    //       mongoose.Types.ObjectId('4ed3ede8844f0f351100000c'),
    //       mongoose.Types.ObjectId('4ed3f117a844e0471100000d'), 
    //       mongoose.Types.ObjectId('4ed3f18132f50c491100000e')
    //   ]}
    // query = filter;
    debugger;
  }
  if (typeof req.query.sort !== 'undefined') {
    let sort = JSON.parse(req.query.sort);
    options.sort = {}
    options.sort[sort[0]] = sort[1] === "DESC" ? -1 : 1;
  }
  if (typeof req.query.limit !== 'undefined' && typeof req.query.skip !== 'undefined') {
    options.offset = JSON.parse(req.query.skip);
    options.limit = JSON.parse(req.query.limit);
  }

  User.paginate(query,options).then(function (result) {
    res.setHeader("Content-Range", `10 ${result.offset}-${result.offset + result.limit}/${result.total}`);
    return res.json(result.docs.map(user => user.toConfigAuthJSONTEST()));
  }).catch(next);
});

router.delete("/user/:id", function(req, res, next) {
  User.findByIdAndDelete(req.params.id)
    .then(function(user) {
      if (!user) {
        return res.sendStatus(401);
      }
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});
//---test---//

router.put('/users', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    // only update fields that were actually passed...
    if (typeof req.body.user.username !== 'undefined') {
      user.username = req.body.user.username;
    }
    if (typeof req.body.user.email !== 'undefined') {
      user.email = req.body.user.email;
    }
    if (typeof req.body.user.bio !== 'undefined') {
      user.bio = req.body.user.bio;
    }
    if (typeof req.body.user.image !== 'undefined') {
      user.image = req.body.user.image;
    }
    if (typeof req.body.user.password !== 'undefined') {
      user.setPassword(req.body.user.password);
    }

    return user.save().then(function () {
      return res.json({ user: user.toAuthJSON() });
    });
  }).catch(next);
});

router.post('/users/login', function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } });
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } });
  }

  passport.authenticate('local', { session: false }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});

router.post('/users', function (req, res, next) {
  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.setPassword(req.body.user.password);

  user.save().then(function () {
    return res.json({ user: user.toAuthJSON() });
  }).catch(next);
});

router.put('/users/config', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    // only update fields that were actually passed...
    if (typeof req.body.user.config !== 'undefined') {
      user.config = req.body.user.config;
    }
    return user.save().then(function () {
      return res.json({ user: user.toAuthJSON() });
    });
  }).catch(next);
});


module.exports = router;
