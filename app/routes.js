//Created by: Alistair Dewar: 20/02/2018
//This page defines and exposes the end points OR Routes which can be called by the external application
//It also defines the type of role and authentication needed before the route method is executed.
//You will note below....we define our routers including the host router apiRoutes.
//We tell the apiRoutes which routes we are working with e.g authRoutes.
//We then define the routes for that route (authRoutes)
//finally, having defined all routes against the api we add apiRoutes to the app....ie the Server
//Here we will add all out API routes for all our Types and Behaviours...
//Note, our behaviours will match the express.Router supported behaviour i.e. Push, Get, Delete, Put, Search etc

var AuthenticationController = require('./controllers/authentication'),
EventsController = require('./controllers/events'),
ThemesController = require('./controllers/themes'), 
FilesController = require('./controllers/files'),
express = require('express'),
passportService = require('../config/passport'),
passport = require('passport');
 
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

    module.exports = function(app){
 
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        eventsRoutes = express.Router(),
        themesRoutes = express.Router(),
        filesRoutes = express.Router(),
        multer = require('multer'),
        DIR = './uploads/';
 
        var upload = multer({dest: DIR}).single('logo');
    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
 
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
 
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
 
    // Todo Routes
    apiRoutes.use('/events', eventsRoutes);
 
    eventsRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), EventsController.getEvents);
    eventsRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), EventsController.createEvent);
    eventsRoutes.delete('/:event_id', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), EventsController.deleteEvent);
 
    //Causes Routes
    apiRoutes.use('/themes', themesRoutes);
    
    themesRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), ThemesController.getThemes);
    themesRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), ThemesController.createTheme);
    themesRoutes.delete('/:theme_id', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), ThemesController.deleteTheme);
    
    //Causes Routes
    apiRoutes.use('/files', filesRoutes);
    
    //filesRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), FilesController.getFiles);
    //filesRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), FilesController.createFile);
    //filesRoutes.delete('/:file_id', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), FilesController.deleteFile);
    
    filesRoutes.get('/',  FilesController.getHome);
    filesRoutes.post('/', FilesController.uploadFile);
    // Set up routes
    app.use('/api', apiRoutes);
 
}