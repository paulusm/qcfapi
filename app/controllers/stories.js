var Story = require('../models/story');

exports.getStories = function(req, res, next){

   Story.find(function(err, stories) {

       if (err){
           res.send(err);
       }

       res.json(stories);

   });

}

exports.getApprovedStories = function(req, res, next){
    console.log("Starting Approved Retrieval");
    var companyid = req.params.company_id;
    console.log("CompanyID:" + companyid);

       Story.find({$or:[{companyid: companyid},{companyid:'5ab7dbc0bc24e3001440543c'}],approved:'true'},function(err, stories) {
    
           if (err){
               res.send(err);
           }
    
           res.json(stories);
    
       });
    
    }

    exports.getUnapprovedStories = function(req, res, next){
        console.log("Starting unaproved Retrieval");
        var companyid = req.params.company_id;
        console.log("CompanyID:" + companyid);
           Story.find({$or:[{companyid: companyid},{companyid:'5ab7dbc0bc24e3001440543c'}],approved:'false'}, function(err, stories) {
        
               if (err){
                   res.send(err);
               }
        
               res.json(stories);
        
           });
        
        }

exports.createStory = function(req, res, next){

    var companyid = "";

    if(req.body.companyid == null){
        companyid = "5ab7dbc0bc24e3001440543c";
    }else{
        companyid = req.body.companyid;
    }

    if(!req.body.storytitle){
        return res.status(422).send({error: 'You must enter a title for this article.'});
    }

    if(!req.body.story){
        return res.status(422).send({error: 'You must enter some details for this article.'});
    }

    if(!req.body.type){
        return res.status(422).send({error: 'You must select a type for this article.'});
    }

   Story.create({
       storytitle : req.body.storytitle,
       story : req.body.story,
       themeid : req.body.themeid,
       imagepath : req.body.imagepath,
       storyauthor: req.body.storyauthor,
       publisheddate: req.body.publisheddate,
       likes : req.body.likes,
       type :req.body.type,
       approved: false,
       companyid:companyid
      

   }, function(err, story) {

       if (err){
           res.send(err);
       }

       Story.find(function(err, stories) {

           if (err){
               res.send(err);
           }

           res.json(stories);

       });

   });

}

exports.updateStory = function(req, res, next){
   
        console.log(req.body.storytitle);
        var storytitle = req.body.storytitle;
        var storyid = req.body._id;
        var companyid = "";
      
        if(req.body.companyid == null){
            companyid = "5ab7dbc0bc24e3001440543c";
        }else{
            companyid = req.body.companyid;
        }
     
        console.log("Updating Story:" + storytitle);

      if(!storytitle){
          return res.status(422).send({error: 'You must enter an storytitle'});
      }
   
      
      Story.findOne({_id: storyid}, function(err, existingStory){
          
          if(err){
              return next(err);
          }
   
          if(!existingStory){
              return res.status(422).send({error: 'Cannot find your story.'});
          }
          console.log("Found story and updating");
          //add company id check here....
          existingStory.storytitle = req.body.storytitle;
          existingStory.story = req.body.story;
          existingStory.themeid = req.body.themeid;
          existingStory.imagepath = req.body.imagepath;
          existingStory.storyauthor = req.body.storyauthor;
          existingStory.publiseddate = req.body.publisheddate;
          existingStory.likes = req.body.likes;
          existingStory.type = req.body.type;
          existingStory.approved = req.body.approved;
          existingStory.companyid = companyid;
          
          
   
          existingStory.save(function(err, story){
   
              if(err){
                console.log("Error updating story.");
                  return next(err);
              }
   
              //var userInfo = setUserInfo(user);
   
              res.status(201).json({
                  story: existingStory
              })
   
          });
   
      });
   
  }

exports.deleteStory = function(req, res, next){

   Story.remove({
       _id : req.params.story_id
   }, function(err, story) {
       res.json(story);
   });

}