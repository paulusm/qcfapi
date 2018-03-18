//var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
//var mongoose = require('mongoose');
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;
//var bcrypt = require('bcrypt-nodejs');
//var User = require('../models/user');
//var authConfig = require('../../config/auth');
 

/* function setUserInfo(request){
    return {
        //_id: request._id,
        email: request.email,
        role: request.role,
        forname:request.forname,
        surname:request.surname,
        department:request.depart,
        companyid:request.companyid,
        displayname:request.displayname,
        isfirstlogin:request.isfirstlogin

    };
} */
 
 
//Get all companies from database
exports.getUsers = function(req, res, next){
    
       User.find(function(err, users) {
    
           if (err){
               res.send(err);
           }
    
           res.json(users);
    
       });
    
    }
     
    

exports.updateprofile = function(req, res, next){
 
    var email = req.body.email;

    console.log("Updating User Profile:" + email);
    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }
 
    
    User.findOne({email: email}, function(err, existingUser){
        
        if(err){
            return next(err);
        }
 
        if(!existingUser){
            return res.status(422).send({error: 'Cannot find your profile, this user does not exist'});
        }
        console.log("Found user and updating");
        //add company id check here....
        existingUser.companyid = req.body.companyid;
        existingUser.forname = req.body.forename;
        existingUser.surname = req.body.surname;
        existingUser.department = req.body.department;
        existingUser.displayname = req.body.displayname;
        existingUser.imagepath = req.body.imagepath;
        existingUser.role = req.body.role;
        //existingUser.isfirstlogin = "false";
 
        existingUser.save(function(err, user){
 
            if(err){
                return next(err);
            }
 
            //var userInfo = setUserInfo(user);
 
            res.status(201).json({
                user: existingUser
            })
 
        });
 
    });
 
}
 
