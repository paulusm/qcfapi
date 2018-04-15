var Theme = require('../models/theme');

exports.getThemes = function(req, res, next){

   Theme.find(function(err, themes) {

       if (err){
           res.send(err);
       }

       res.json(themes);

   });

}

exports.getThemeById = function(req, res, next){
    
    console.log("Before:" + req.params.theme_id);
    var themeid = decodeURI(req.params.theme_id);
    console.log("After: " + themeid);
    Theme.findById({_id: themeid}, function(err, existingTheme){
    
            if(err){
                return next(err);
            }
    
            if(!existingTheme){
                return res.status(422).send({error: 'Cannot find this theme, this theme does not exist'});
            }


            res.status(201).json({
                theme: existingTheme
            })
            

        });
    
    }

exports.createTheme = function(req, res, next){
        
        console.log("Creating Theme");
        //console.log(req);
        var name = req.body.name;
        var areasData = req.body.areas;

        console.log(name);
        console.log(areasData);
        console.log("Registering New Theme");

        
        
        Theme.create({
            name:name,
            areas:areasData
            
        },
        function(err, item){
    
        if(err){
            return next(err);
        }
                    
        Theme.find(function(err, themes) {

            if (err){
                res.send(err);
            }
            console.log(themes);
            res.json(themes);

        });
              
    
        });

  

}

exports.deleteTheme = function(req, res, next){

   Theme.remove({
       name : req.params.theme_id
   }, function(err, theme) {
       res.json(theme);
   });

}