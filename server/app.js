// Importing Node modules and initializing Express
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('./config/main');
var routes = require('./api/routes');

// Database Connection
var connection = mongoose.connect(config.database);

mongoose.connection.on('connected', function () {  
  console.log('Connected successfully', config.database);
}); 

mongoose.connection.on('error', function (error) {  
  console.log('Connection error: ', error);
}); 

// Start the server
var server = app.listen(config.port, function(){
	console.log('Your server is running on port ' + server.address().port + '.'); 
});

app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());  
//app.use(logger('dev')); // Log requests to API using morgan

// Setting up basic middleware for all Express requests

// Enable CORS from client-side
app.use(function(req, res, next) {  
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Add some routing
app.use('/api', routes);

// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'node_modules')));
app.get('/*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
