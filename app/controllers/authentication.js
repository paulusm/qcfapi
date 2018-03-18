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

function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}
 
function setUserInfo(request){
    console.log("setUserInfo:"+request)
    return {
        _id: request._id,
        email: request.email,
        role: request.role,
        forename:request.forename,
        surname:request.surname,
        department:request.depart,
        companyid:request.companyid,
        displayname:request.displayname,
        isfirstlogin:request.isfirstlogin

    };
}

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
        password:request.body.password

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
            isfirstlogin: 'true'
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

  console.log("Changing User Password:"+ JSON.stringify(req.body));

        User.findOne({email:req.user.email}, function(err, existingUser){
          if (!existingUser) {
            //req.flash('error', 'Password reset token is invalid or has expired.');
            console.log("This user does not exist.");
            res.json('This user does not exist.');
          }

          //User will already be authenticated with old password at this point
          //Need to change password to newpassword and generate new token
          //var userInfo = setUserInfo(req.user);
          console.log("Creating new user object");
          var userInfo = new User({
            email: req.user.email,
            password: req.user.newpassword,
            role: existingUser.role,
            forename: existingUser.forename,
            surname: existingUser.surname,
            department: existingUser.department,
            displayname: existingUser.displayname,
            imagepath: existingUser.imagepath,
            companyid: existingUser.companyid,
            isfirstlogin: 'false',
            resetpasswordtoken: undefined,
            resetpasswordexpires: undefined
        });
             /* res.status(200).json({
                 token: 'JWT ' + generateToken(userInfo),
                 user: userInfo
             }); */

          //User must be authenticated to call this function to only need to change password...
          //Of course will need to re-authenticate and pass new token back in response
          //userInfo.password = req.body.newpassword;
          //userInfo.resetpasswordtoken = undefined;
          //userInfo.resetpasswordexpires = undefined;
  
          userInfo.save(function(err) {

            if(err){
              res.status(422).json({error: 'No user found.'});
              return next(err);
            }
            //req.logIn(user, function(err) {
              res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
              });
              next();
            //});
          });
        });
}

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
            //req.flash('error', 'No account with that email address exists.');
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
          host:"smtp-mail.outlook.com",
          //service: 'Hotmail',
          port:587,
          tls:{
              ciphers:'SSLv3'
          },
          auth: {
            user: 'al_dewar@hotmail.com',
            pass: '"ws3ed741'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'al_dewar@hotmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following code:\n\n' +
            token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            console.log('SendMail Found');
          res.json('An e-mail has been sent to ' + user.email + ' with further instructions.');
          next();
          //done(err, 'done');
        });
      }
    ], function(err) {
      if (err){
          next(err);
          return;
      } 
      //res.redirect('/forgot');
    });
  };

  exports.resetget = function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        //req.flash('error', 'Password reset token is invalid or has expired.');
        res.json('No account with that email address exists.');
      }
      res.status(201).json({
        user: user
        });
      });
    };
  

  exports.resetpost = function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetpasswordtoken: req.body.token, resetpasswordexpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            //req.flash('error', 'Password reset token is invalid or has expired.');
            res.json('Password reset token is invalid or has expired.');
          }
  
          user.password = req.body.newpassword;
          user.resetpasswordtoken = undefined;
          user.resetpasswordexpires = undefined;
  
          user.save(function(err) {
            //req.logIn(user, function(err) {
              done(err, user);
            //});
          });
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
            host:"smtp-mail.outlook.com",
            //service: 'Hotmail',
            port:587,
            tls:{
                ciphers:'SSLv3'
            },
            auth: {
              user: 'al_dewar@hotmail.com',
              pass: '"ws3ed741'
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'al_dewar@hotmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          //req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      //res.redirect('/');
      res.json('Password reset complete.');
    });
  };