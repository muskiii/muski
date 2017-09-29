'use strict';
module.exports = function(app) {
  var groceries = require('../../controllers/groceries/groceries');

  // groceries Routes
  app.route('/groceries')
    .get(groceries.getAll)
    .post(groceries.create);

  app.route('/groceries/:groceryId')
    .delete(groceries.deleteOne);
};
