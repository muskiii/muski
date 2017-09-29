var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  mongoose = require('mongoose'),
  Grocery = require('./api/models/groceries/grocery'), //created model loading here
  bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://muski:pa55word@ds149324.mlab.com:49324/muski'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/groceries/groceries'); //importing route
routes(app); //register the route
app.use(function(req, res){
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);

console.log('muski Rest API server started on:' + port);
