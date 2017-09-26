'use strict';


var mongoose = require('mongoose'),
  Grocery = mongoose.model('Grocery');

exports.getAll = function(req, res) {
  Grocery.find({},function(err, grocery) {
    if (err)
      res.send(err);
    console.dir(grocery);
    res.json(grocery);
  });
};

exports.create = function(req, res) {
  var new_grocery = new Grocery(req.body);
  new_grocery.save(function(err, grocery) {
    if (err)
      res.send(err);
    console.log(req.body);
    res.json(grocery);
  });
};

exports.deleteOne = function(req, res) {
  Grocery.remove({
    _id: req.params.groceryId
  }, function(err, grocery) {
    if (err)
      res.send(err);
    res.json({ message: 'Grocery successfully deleted' });
  });
};
