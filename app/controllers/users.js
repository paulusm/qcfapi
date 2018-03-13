var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
//var authConfig = require('../../config/auth');
 

function setUserInfo(request){
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
}
 
 
exports.updateprofile = function(req, res, next){
 
    var email = req.email;

    console.log("Updating User Profile");
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
 
        //add company id check here....
        existingUser.companyid = req.companyid;
        existingUser.forname = req.forename;
        existingUser.surname = req.surname;
        existingUser.department = req.department;
        existingUser.displayname = req.displayname;
        existingUser.imagepath = req.imagepath;
        existingUser.role = req.role;
        existingUser.isfirstlogin = req.isfirstlogin;
 
        user.save(function(err, user){
 
            if(err){
                return next(err);
            }
 
            var userInfo = setUserInfo(user);
 
            res.status(201).json({
                user: userInfo
            })
 
        });
 
    });
 
}
 
