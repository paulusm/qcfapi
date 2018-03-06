var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
var authConfig = require('../../config/auth');
 

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
        forname:request.forname,
        surname:request.surname,
        department:request.depart,
        companyid:request.companyid,
        displayname:request.displayname,
        isfirstlogin:request.isfirstlogin

    };
}

function setUserInfoReg(request){
    console.log("setUserInfo:"+request)
    return {
        _id: request.body._id,
        email: request.body.email,
        role: request.body.role,
        forname:request.body.forname,
        surname:request.body.surname,
        department:request.body.depart,
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
 
    console.log("Registering New User:"+ req.body)
    /* var email = req.body.email;
    var password = req.body.password;
    var role = req.body.role; */
    var userinfo = setUserInfoReg(req);

    console.log("Registering New User");
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
            companyid: userinfo.companyid
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
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
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