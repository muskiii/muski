var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
  mongoose = require('mongoose'),
  Grocery = require('./api/models/groceries/grocery'), //created model loading here
  bodyParser = require('body-parser');
  var path = require('path');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://muski:pa55word@ds149324.mlab.com:49324/muski'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/static',express.static('public'));

if(process.env.NODE_ENV=="dev"){
  app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/DevIndex.html'));
});
}

if(process.env.NODE_ENV=="prod"){
  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/ProdIndex.html'));
});
}

//importing route
var routes = require('./api/routes/groceries/groceries');
//register the route
routes(app); 
//filter 404
app.use(function(req, res){
  res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(process.env.PORT);
console.log("ENV: "+process.env.NODE_ENV);

console.log('muski Rest API server started on:' + port);
