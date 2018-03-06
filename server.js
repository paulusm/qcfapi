//Created By Alistair Dewar:20/02/2018
//Entry point of service
//Here we set up the ports on which the server will listen and attach our Router to our app.
//It looks like we also set up other services on the App including JSON Parser, Logging etc....but still need to get my head round this

var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var databaseConfig = require('./config/database');
var router = require('./app/routes');

//app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(databaseConfig.url);
 
app.listen(process.env.PORT || 8100, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
  /* var corsOptions = {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
  }*/
//app.use(cors(corsOptions));

app.use(function(req, res, next) { //allow cross origin requests
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "");
  res.header("Access-Control-Allow-Headers", "Authorization, Content-Length, Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
//app.listen(process.env.PORT || 8080);
//console.log("App listening on port 8080");
//app.use(express.static(__dirname, 'public'));
app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
//app.use(cors());
 
router(app);