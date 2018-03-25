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
ActivitiesController = require('./controllers/activities'),
ThemesController = require('./controllers/themes'), 
FilesController = require('./controllers/files'),
CompaniesController = require('./controllers/companies'),
StoriesController = require('./controllers/stories'),
express = require('express'),
passportService = require('../config/passport'),
passport = require('passport');
UsersController = require('./controllers/users');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});
    
module.exports = function(app){

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        activitiesRoutes = express.Router(),
        themesRoutes = express.Router(),
        companiesRoutes = express.Router(),
        usersRoutes = express.Router(),
        storiesRoutes = express.Router(),
        filesRoutes = express.Router();
 
    // Auth Routes
    apiRoutes.use('/auth', authRoutes);
 
    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/forgot', AuthenticationController.forgot);
    //authRoutes.get('/reset/:token', AuthenticationController.resetget)
    authRoutes.post('/resetchg', AuthenticationController.resetpost)
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    authRoutes.post('/changepassword', AuthenticationController.changepassword);

    
    
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });
 
    apiRoutes.use('/users', usersRoutes);
    usersRoutes.get('/',requireAuth,AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), UsersController.getUsers);
    usersRoutes.post('/updateprofile', requireAuth, AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), UsersController.updateprofile);


    // Activities Routes
    apiRoutes.use('/activities', activitiesRoutes);
 
    activitiesRoutes.get('/getActivitiesUnapproved/:company_id', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), ActivitiesController.getActivitiesUnapproved);
    activitiesRoutes.get('/getActivities', requireAuth, AuthenticationController.roleAuthorization(['QCFAdmin']), ActivitiesController.getActivities);
    activitiesRoutes.post('/createActivity', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), ActivitiesController.createActivity);
    activitiesRoutes.delete('/deleteActivity/:activity_id', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), ActivitiesController.deleteActivity);
 
    // Stories Routes
    apiRoutes.use('/stories', storiesRoutes);

    storiesRoutes.get('/getStories', requireAuth, AuthenticationController.roleAuthorization(['QCFAdmin']), StoriesController.getStories);
    storiesRoutes.post('/createStory', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), StoriesController.createStory);
    storiesRoutes.post('/updateStory', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), StoriesController.updateStory);
    storiesRoutes.delete('/deleteStory/:story_id', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), StoriesController.deleteStory);

    //Causes Routes
    apiRoutes.use('/themes', themesRoutes);
    
    themesRoutes.get('/getThemes', requireAuth, AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), ThemesController.getThemes);
    themesRoutes.post('/createTheme', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), ThemesController.createTheme);
    themesRoutes.delete('/deleteTheme/:theme_id', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), ThemesController.deleteTheme);
    
    //File Routes
    apiRoutes.use('/files', filesRoutes);
    
    filesRoutes.get("/file/:filename", FilesController.getFile);
    filesRoutes.post('/upload', FilesController.createFile);
    
    apiRoutes.use('/companies', companiesRoutes);
    companiesRoutes.get('/getCompanies', requireAuth, AuthenticationController.roleAuthorization(['QCFAdmin']),CompaniesController.getCompanies);
    companiesRoutes.get('/getCompanyByCompanyName/:companyname',requireAuth, AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), CompaniesController.getCompanyByName);
    companiesRoutes.get('/getCompanyByCompanyId/:company_id',requireAuth, AuthenticationController.roleAuthorization(['Employee','BusinessAdmin','QCFAdmin']), CompaniesController.getCompanyByID);
    companiesRoutes.post('/createCompany', requireAuth, AuthenticationController.roleAuthorization(['QCFAdmin']),CompaniesController.createCompany);
    companiesRoutes.post('/updateCompany', requireAuth, AuthenticationController.roleAuthorization(['BusinessAdmin','QCFAdmin']), CompaniesController.updateCompany);
    
    //companiesRoutes.delete();


    // Set up routes
    app.use('/api', apiRoutes);
 
}