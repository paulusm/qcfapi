//var jwt = require('jsonwebtoken'); 
var User = require('../models/user');
 
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
        existingUser.forename = req.body.forename;
        existingUser.surname = req.body.surname;
        existingUser.department = req.body.department;
        existingUser.displayname = req.body.displayname;
        existingUser.imagepath = req.body.imagepath;
        existingUser.role = req.body.role;
        existingUser.about = req.body.about;
        existingUser.jobtitle = req.body.jobtitle;
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

 exports.getUsersByCompanyId = function(req, res, next){

    //console.log("Before:" + req.params.company_id);
    var companyid = decodeURI(req.params.company_id);
    //console.log("After: " + companyid);

    User.find({companyid: companyid}, function(err, users){
    
            if(err){
                return next(err);
            }
    
            if(!users){
                return res.status(422).send({error: 'Cannot find any users for this company.'});
            }


            res.status(201).json(users);

        });
}
exports.deleteUser = function(req, res, next){
    
       
   User.remove({
        _id : req.params.user_id
    }, function(err, user) {
        res.json(user);
    });
    }
