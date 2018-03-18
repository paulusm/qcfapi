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
        companyid: req.body.companyid
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
 
exports.deleteActivity = function(req, res, next){
 
    Activity.remove({
        _id : req.params.activity_id
    }, function(err, activity) {
        res.json(activity);
    });
 
}