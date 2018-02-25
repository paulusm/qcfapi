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
express = require('express'),
passportService = require('../config/passport'),
passport = require('passport');
 
var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

    module.exports = function(app){
 
    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        eventsRoutes = express.Router(),
        themesRoutes = express.Router();
 
    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
 
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
 
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
 
    // Todo Routes
    apiRoutes.use('/events', eventsRoutes);
 
    eventsRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), EventsController.getEvents);
    eventsRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['creator','editor']), EventsController.createEvent);
    eventsRoutes.delete('/:event_id', requireAuth, AuthenticationController.roleAuthorization(['editor']), EventsController.deleteEvent);
 
    //Causes Routes
    apiRoutes.use('/themes', themesRoutes);
    
    themesRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['reader','creator','editor']), ThemesController.getThemes);
    themesRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['creator','editor']), ThemesController.createTheme);
    themesRoutes.delete('/:theme_id', requireAuth, AuthenticationController.roleAuthorization(['editor']), ThemesController.deleteTheme);
    
    //Causes Routes
    apiRoutes.use('/files', filesRoutes);
    
    filesRoutes.get('/', FilesController.getFiles);
    filesRoutes.post('/', FilesController.createFile);
    filesRoutes.delete('/:file_id', FilesController.deleteFile);
  

    // Set up routes
    app.use('/api', apiRoutes);
 
}