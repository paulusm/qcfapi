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
    

    // Set up routes
    app.use('/api', apiRoutes);
 
}