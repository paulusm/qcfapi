var Faq = require('../models/faq');

exports.getFaqs = function(req, res, next){

   Faq.find(function(err, faqs) {

       if (err){
           res.send(err);
       }

       res.json(faqs);

   });

}


  

exports.createFaq = function(req, res, next){

    var companyid = "";

    if(req.body.companyid == null){
        companyid = "5ab7dbc0bc24e3001440543c";
    }else{
        companyid = req.body.companyid;
    }

    if(!req.body.faqtitle){
        return res.status(422).send({error: 'You must enter a title for this faq.'});
    }

    if(!req.body.faq){
        return res.status(422).send({error: 'You must enter some details for this faq.'});
    }

   

   Faq.create({
       faqtitle : req.body.faqtitle,
       faq : req.body.faq,
       companyid : req.body.companyid,
       imagepath : req.body.imagepath
      

   }, function(err, faq) {

       if (err){
           res.send(err);
       }

       Faq.find(function(err, faqs) {

           if (err){
               res.send(err);
           }

           res.json(faqs);

       });

   });

}

exports.updateFaq = function(req, res, next){
   
        console.log(req.body.faqtitle);
        var faqtitle = req.body.faqtitle;
        var faqid = req.body._id;
        var companyid = "";
      
        if(req.body.companyid == null){
            companyid = "5ab7dbc0bc24e3001440543c";
        }else{
            companyid = req.body.companyid;
        }
     
        console.log("Updating Story:" + faqtitle);

      if(!faqtitle){
          return res.status(422).send({error: 'You must enter an title'});
      }
   
      
      Faq.findOne({_id: faqid}, function(err, existingFaq){
          
          if(err){
              return next(err);
          }
   
          if(!existingFaq){
              return res.status(422).send({error: 'Cannot find your faq.'});
          }
          console.log("Found faq and updating");
          //add company id check here....
          existingFaq.storytitle = req.body.faqtitle;
          existingFaq.faq = req.body.faq;
          existingFaq.imagepath = req.body.imagepath;
          existingFaq.companyid = companyid;
          
          
   
          existingFaq.save(function(err, faq){
   
              if(err){
                  return next(err);
              }
   
              //var userInfo = setUserInfo(user);
   
              res.status(201).json({
                  faq: existingFaq
              })
   
          });
   
      });
   
  }

exports.deleteStory = function(req, res, next){

   Faq.remove({
       _id : req.params.faq_id
   }, function(err, faq) {
       res.json(faq);
   });

}