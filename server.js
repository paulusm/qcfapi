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
 
// Multer Settings for file upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+ "_" + file.originalname)
    }
})

var upload = multer({
    storage: Storage
}).array("imgUploader", 3); //Field name and max count



mongoose.connect(databaseConfig.url);
 
app.listen(process.env.PORT || 8100, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

//app.listen(process.env.PORT || 8080);
//console.log("App listening on port 8080");

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());
 
router(app);