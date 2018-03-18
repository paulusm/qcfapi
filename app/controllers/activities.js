var Activity = require('../models/activity');
 
exports.getActivities = function(req, res, next){
 
    Activity.find(function(err, activities) {
 
        if (err){
            res.send(err);
        }
 
        res.json(activities);
 
    });
 
}
 
exports.createActivity = function(req, res, next){
 
    Activity.create({
        activityname : req.body.activityname,
        activitydescription : req.body.activitydescription,
        activityowner : req.body.activityowner,
        activitytype : req.body.activitytype,
        companyid: req.body.companyid,
        donationmatch: req.body.donationmatch,
        approved : req.body.approved,
        enddate :req.body.enddate,
        startdate : req.body.startdate,
        mydonateurl : req.body.mydonateurl,
        likes : req.body.likes,
        volunteers : req.body.volunteers,
        sponsors : req.body.sponsors

    }, function(err, activity) {
 
        if (err){
            res.send(err);
        }
 
        Activity.find(function(err, activities) {
 
            if (err){
                res.send(err);
            }
 
            res.json(activities);
 
        });
 
    });
 
}
 
exports.updateActivity = function(req, res, next){
    
       var activityname = req.body.activity;
   
       console.log("Updating Activity:" + activityname);
       if(!activityname){
           return res.status(422).send({error: 'You must enter an activityname'});
       }
    
       
       Activity.findOne({activityname: activityname}, function(err, existingActivity){
           
           if(err){
               return next(err);
           }
    
           if(!existingActivity){
               return res.status(422).send({error: 'Cannot find your activity.'});
           }
           console.log("Found activity and updating");
           //add company id check here....
           existingActivity.activityname = req.body.activityname;
           existingActivity.activitydescription = req.body.activitydescription;
           existingActivity.activityowner = req.body.surname;
           existingActivity.activitytype = req.body.department;
           existingActivity.donationmatch = req.body.displayname;
           existingActivity.approved = req.body.imagepath;
           existingActivity.companyid = req.body.companyid;
           existingActivity.enddate = req.body.enddate;
           existingActivity.startdate = req.body.startdate;
           existingActivity.mydonateurl = req.body.mydonateurl;
           existingActivity.likes = req.body.likes;
           existingActivity.volunteers = req.body.volunteers;
           existingActivity.sponsors = req.body.sponsors;
           //existingUser.isfirstlogin = "false";
    
           existingActivity.save(function(err, activity){
    
               if(err){
                   return next(err);
               }
    
               //var userInfo = setUserInfo(user);
    
               res.status(201).json({
                   activity: existingActivity
               })
    
           });
    
       });
    
   }

exports.deleteActivity = function(req, res, next){
 
    Activity.remove({
        _id : req.params.activity_id
    }, function(err, activity) {
        res.json(activity);
    });
 
}