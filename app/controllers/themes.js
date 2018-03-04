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
        var areas = req.body.areas;
        console.log(name);
        console.log(areas);
        console.log("Registering New Theme");

        
        Theme.create({
            name:name,
            areas:areas
            
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
              
    
        });

  

}

exports.deleteTheme = function(req, res, next){

   Theme.remove({
       _id : req.params.theme_id
   }, function(err, theme) {
       res.json(theme);
   });

}