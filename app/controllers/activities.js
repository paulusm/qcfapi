var Activity = require('../models/activity');
 
exports.getActivities = function(req, res, next){
 
    Activity.find(function(err, activities) {
 
        if (err){
            res.send(err);
        }
 
        res.json(activities);
 
    });
 
}
 
//Can be called by Employee as approval is default to False....
exports.createActivity = function(req, res, next){
 
    Activity.create({
        activityname : req.body.activityname,
        activitydescription : req.body.activitydescription,
        activityowner : req.body.activityowner,
        activitytype : req.body.activitytype,
        companyid: req.body.companyid,
        donationmatch: req.body.donationmatch,
        approved : false,
        enddate :req.body.enddate,
        startdate : req.body.startdate,
        mydonateurl : req.body.mydonateurl,
        likes : req.body.likes,
        volunteers : req.body.volunteers,
        sponsors : req.body.sponsors,
        location : req.body.location,
        address : req.body.address,
        filename: req.body.filename

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
 

//Can only be called by Business Admin as will handle approval....
exports.updateActivity = function(req, res, next){
    
        console.log("Request:" + JSON.stringify(req.body) );
       var activityid = req.body._id;
       var activityname = req.body.activityname;
       console.log("Updating Activity:" + activityid);

       if(!activityname){
           return res.status(422).send({error: 'You must enter an activityname'});
       }
    
       
       Activity.findOne({_id: activityid}, function(err, existingActivity){
           
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
           existingActivity.activityowner = req.body.activityowner;
           existingActivity.activitytype = req.body.activitytype;
           existingActivity.donationmatch = req.body.donationmatch;
           existingActivity.approved = false;
           existingActivity.companyid = req.body.companyid;
           existingActivity.enddate = req.body.enddate;
           existingActivity.startdate = req.body.startdate;
           existingActivity.mydonateurl = req.body.mydonateurl;
           existingActivity.likes = req.body.likes;
           existingActivity.volunteers = req.body.volunteers;
           existingActivity.sponsors = req.body.sponsors;
           existingActivity.filename = req.body.filename;
           
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

exports.approveActivity = function(req, res, next){
    var activityid = req.body._id;
    var activityname = req.body.activityname;
   console.log("Updating Activity:" + activityid);
   //if(!activityname){
   //    return res.status(422).send({error: 'You must enter an activityname'});
   //}

   
   Activity.findOne({_id: activityid}, function(err, existingActivity){
       
       if(err){
           return next(err);
       }

       if(!existingActivity){
           return res.status(422).send({error: 'Cannot find your activity.'});
       }
       console.log("Found activity and updating");
       //add company id check here....
       //existingActivity.activityname = req.body.activityname;
       //existingActivity.activitydescription = req.body.activitydescription;
       //existingActivity.activityowner = req.body.activityowner;
       //existingActivity.activitytype = req.body.activitytype;
       //existingActivity.donationmatch = req.body.donationmatch;
       existingActivity.approved = false;
       //existingActivity.companyid = req.body.companyid;
       //existingActivity.enddate = req.body.enddate;
       //existingActivity.startdate = req.body.startdate;
       //existingActivity.mydonateurl = req.body.mydonateurl;
       //existingActivity.likes = req.body.likes;
       //existingActivity.volunteers = req.body.volunteers;
       //existingActivity.sponsors = req.body.sponsors;
       //existingActivity.filename = req.body.filename;
       
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

exports.getActivitiesUnapproved = function(req,res,next){
    console.log("Before:" + req.params.company_id);
    var company_id = decodeURI(req.params.company_id);
    console.log("After: " + company_id);
    //if QCF, Get All Unapproved
    if(company_id == '5ab7dbc0bc24e3001440543c')
    {
        Activity.find({approved:'false'}, function(err, activities){
            
                    if(err){
                        return next(err);
                    }
            
                    if(!activities){
                        return res.status(201).send({error: 'All activities approved.'});
                    }
        
        
                    res.status(201).json(activities);
        
                });
    }else{
    Activity.find({companyid: company_id,approved:'false'}, function(err, activities){
    
            if(err){
                return next(err);
            }
    
            if(!activities){
                return res.status(201).send({error: 'All activities approved.'});
            }


            res.status(201).json(activities);

        });
    }
}

exports.getFutureActivitiesApprovedByCompanyID = function(req, res, next){
    //console.log("Before:" + req.params.company_id);
    var company_id = decodeURI(req.params.company_id);
    //console.log("After: " + company_id);
    var today = new Date();
    Activity.find({companyid: company_id,approved:'true', "startdate":{"$gt":today}}, function(err, activities){
    
            if(err){
                return next(err);
            }
    
            if(!activities){
                return res.status(201).send({error: 'No future activities found.'});
            }


            res.status(201).json(activities);

        });
}

exports.getActivityByOwnerID = function(req,res,next){
    //console.log("Before:" + req.params.company_id);
    var company_id = decodeURI(req.params.owner_id);
    //console.log("After: " + company_id);
    Activity.find({activityowner: company_id}, function(err, activities){
    
            if(err){
                return next(err);
            }
    
            if(!activities){
                return res.status(201).send({error: 'You have no activities in your name.'});
            }


            res.status(201).json(activities);

        });
}

//Can be called by Employee's as only updates Likes, Volunteers and Sponsors...
exports.updateActivityAsEmployee = function(req, res, next){
    
       var activityid = req.body._id;
   
       console.log("Updating Activity:" + activityid);
    
       
       Activity.findOne({_id: activityid}, function(err, existingActivity){
           
           if(err){
               return next(err);
           }
    
           if(!existingActivity){
               return res.status(422).send({error: 'Cannot find your activity.'});
           }
           console.log("Found activity and updating");
           //add company id check here....
           //existingActivity.activityname = req.body.activityname;
           //existingActivity.activitydescription = req.body.activitydescription;
           //existingActivity.activityowner = req.body.surname;
           //existingActivity.activitytype = req.body.department;
           //existingActivity.donationmatch = req.body.displayname;
           //existingActivity.approved = req.body.imagepath;
           //existingActivity.companyid = req.body.companyid;
           //existingActivity.enddate = req.body.enddate;
           //existingActivity.startdate = req.body.startdate;
           //existingActivity.mydonateurl = req.body.mydonateurl;
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

