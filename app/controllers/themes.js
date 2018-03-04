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
        var subThemes = req.body.subThemes;
        console.log(name);
       
        console.log("Registering New Theme");

        
        Theme.create({
            name:name,
            subThemes:subThemes
            
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