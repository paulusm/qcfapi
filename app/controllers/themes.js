var Theme = require('../models/theme');

exports.getThemes = function(req, res, next){

   Theme.find(function(err, themes) {

       if (err){
           res.send(err);
       }

       res.json(themes);

   });

}

exports.createTheme = function(req, res, next){
        
        console.log("Creating Theme");
        //console.log(req);
        var name = req.body.name;
        console.log(name);
        var areaname = req.body.areaname;
        console.log(areaname);
        var subject = req.body.subject;
        console.log(subject);
        var companyname = req.body.companyname;
        console.log(companyname);
        var selected = req.body.selected;
        console.log(selected);
        console.log("Registering New Theme");

        if(!areaname){
            return res.status(422).send({error: 'You must enter an areaname'});
        }

        Theme.create({
            name:name,
            areaname:areaname,
            subject:subject,
            companyname:companyname,
            selected:selected
        },
        function(err, item){
    
        if(err){
            return next(err);
        }
                    
        Theme.find(function(err, themes) {

            if (err){
                res.send(err);
            }

            res.json(themes);

        });
               //var userInfo = setUserInfo(user);
                   //res.status(201).json({
               //    token: 'JWT ' + generateToken(userInfo),
               //    user: userInfo
               //})
    
        });

   /* CauseItem.create({
      causeitem
       // title : req.body.title
   }, function(err, causeitem) {
       if (err){
           res.send(err);
       }
       CauseItem.find(function(err, causeitems) {
           if (err){
               res.send(err);
           }
           res.json(causeitems);
       });
   }); */

}

exports.deleteTheme = function(req, res, next){

   Theme.remove({
       _id : req.params.theme_id
   }, function(err, theme) {
       res.json(theme);
   });

}