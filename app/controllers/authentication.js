var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var authConfig = require('../../config/auth');
var session = require('express-session')
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');

//Create new token used for JWT authentication
function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}
 
//Utility method for mapping user data
function setUserInfo(request){
    console.log("setUserInfo:"+request)
    return {
        _id: request._id,
        email: request.email,
        role: request.role,
        forename:request.forename,
        surname:request.surname,
        department:request.department,
        companyid:request.companyid,
        displayname:request.displayname,
        isfirstlogin:request.isfirstlogin,
        imagepath:request.imagepath,
        about:request.about,
        jobtitle:request.jobtitle

    };
}

//Slightly modified utility method for mapping data at registration
function setUserInfoReg(request){
    console.log("setUserInfoReg:"+request)
    return {
        _id: request.body._id,
        email: request.body.email,
        role: request.body.role,
        forename:request.body.forename,
        surname:request.body.surname,
        department:request.body.department,
        companyid:request.body.companyid,
        displayname:request.body.displayname,
        isfirstlogin:request.body.isfirstlogin,
        password:request.body.password,
        imagepath:request.body.imagepath,
        about:request.body.about,
        jobtitle:request.body.jobtitle

    };
}
 
//Actual login handled by passport. Need to return a full user object here
//This method will only execute if login succesful, hence account is valid.
exports.login = function(req, res, next){ 
 
    var userInfo = setUserInfo(req.user);
 
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
 
}
 
//Register new user in application with validation methods
exports.register = function(req, res, next){
 
    console.log("Registering New User:"+ JSON.stringify(req.body));
    /* var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role; */
    var userinfo = setUserInfoReg(req);

    console.log("Registering New User" + JSON.stringify(userinfo));
    if(!userinfo.email){
        console.log('You must enter an email address');
        return res.status(422).send({error: 'You must enter an email address'});
    }
 
    if(!userinfo.password){
        console.log('You must enter a password');
        return res.status(422).send({error: 'You must enter a password'});
    }
 
    User.findOne({email: userinfo.email}, function(err, existingUser){
 
        if(err){
            console.log('Error finding user');
            return next(err);
        }
 
        if(existingUser){
            console.log('User already exists');
            return res.status(422).send({error: 'That email address is already in use'});
        }
 
        //add company id check here....
        console.log('Creating User Object');
         var user = new User({
            email: userinfo.email,
            password: userinfo.password,
            role: userinfo.role,
            forename: userinfo.forename,
            surname: userinfo.surname,
            department: userinfo.department,
            displayname: userinfo.displayname,
            imagepath: userinfo.imagepath,
            companyid: userinfo.companyid,
            isfirstlogin: 'true',
            about: userinfo.about,
            jobtitle:userinfo.jobtitle
        });
        console.log('Saving User Object');
        user.save(function(err, userinfo){
 
            if(err){
                console.log('Error Saving User Object');
                return next(err);
            }
 
            //var userInfo = setUserInfo(user);
            console.log('Returning User Object');
            res.status(201).json({
                token: 'JWT ' + generateToken(userinfo),
                user: userinfo
            })
 
        });
 
    });
 
}
 
//Called when need to check role of a user within a call to a particular Route
exports.roleAuthorization = function(roles){
 
    return function(req, res, next){
 
        var user = req.user;
 
        User.findById(user._id, function(err, foundUser){
 
            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }
 
            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }
 
            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');
 
        });
 
    }
 
}

//change password performs a login first..
exports.changepassword = function(req, res, next) {

        console.log("Changing User Password:"+ req.body.email);
        async.waterfall([
          function(done) {
            crypto.randomBytes(20, function(err, buf) {
              var token = buf.toString('hex');
              done(err, token);
            });
          },

          function(token, done) {
            
            User.findOne({email:req.body.email}, function(err, user){
          
              if (!user) {
                //req.flash('error', 'Password reset token is invalid or has expired.');
                console.log("This user does not exist.");
                res.json('This user does not exist.');
              }

              console.log("User Email:" + req.body.email);
              console.log("User password:" + req.body.password);
              console.log("Creating new user object");
            
              user.password = req.body.password;
              user.isfirstlogin = "false";
              
              user.save(function(err) {
                done(err, token, user);
              });
            });
          },function(token, user, done)
          {
             res.status(201).json({
                  token: 'JWT ' + generateToken(user),
                  user: user
              });
          }], function(err) {
          if (err){
            res.status(422).json({error: 'Problem Updating User.'});
            return next(err);
          } 
        //res.redirect('/forgot');
      });
                 
      }


//Method called to manage forgot password request.
//Checks for validity than creates and sends email with token 
//that has been stored on account to validate the final reset.     
//NOTE:Interesting use of async framework to avoid embedding multiple function.
exports.forgot = function(req, res, next) {
    
    console.log('Starting forgot');
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
          console.log(req.body.email);
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            console.log('Nothing Found');
            return JSON.stringify('No account with that email address exists.');
          }
          console.log(user);
          user.resetpasswordtoken = token;
          user.resetpasswordexpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp-mail.outlook.com',
          secureConnection:false,
          port: 587,
          auth: {
            user: 'alistair2.dewar@live.uwe.ac.uk',
            pass: '6e77ACKR'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'alistair2.dewar@live.uwe.ac.uk',
          subject: 'Node.js Password Reset',
          html: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following code:\n\n' +
            token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            console.log('SendMail Found');
          res.json('An e-mail has been sent to ' + user.email + ' with further instructions.');
          next();
        });
      }
    ], function(err) {
      if (err){
          next(err);
          return;
      } 
    });
  };

  //I think this is now redundent.
  exports.resetget = function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        res.json('No account with that email address exists.');
      }
      res.status(201).json({
        user: user
        });
      });
    };
  

  //Performs tha password reset before sending confirmation email.
  exports.resetpost = function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetpasswordtoken: req.body.token, resetpasswordexpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            res.json('Password reset token is invalid or has expired.');
          }
  
          user.password = req.body.newpassword;
          user.resetpasswordtoken = undefined;
          user.resetpasswordexpires = undefined;
  
          user.save(function(err) {
              done(err, user);
          });
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: 'smtp-mail.outlook.com',
          secureConnection:false,
          port: 587,
          auth: {
            user: 'alistair2.dewar@live.uwe.ac.uk',
            pass: '6e77ACKR'
          }
        });
          var mailOptions = {
            to: user.email,
            from: 'alistair2.dewar@live.uwe.ac.uk',
          subject: 'Your password has been changed',
          html: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ], function(err) {
      res.json('Password reset complete.');
    });
  };