'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var GrocerySchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the grocery name'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grocery', GrocerySchema);
