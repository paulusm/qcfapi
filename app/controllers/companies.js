var Company = require('../models/company');

//Get all companies from database
exports.getCompanies = function(req, res, next){

   Company.find(function(err, companies) {

       if (err){
           res.send(err);
       }

       res.json(companies);

   });

}
 


exports.createCompany = function(req, res, next){

    console.log("Creating Company");
    var companyname = req.body.companyname;
    console.log(companyname);
    var companydescription = req.body.companydescription;
    console.log(companydescription);
    var filename = req.body.filename;
    console.log(filename);
    var email = req.body.email;
    console.log(email);
    var themes = req.body.themes;
    
    console.log("Registering New Company");


   Company.create({
       companyname : companyname,
       companydescription : companydescription,
       filename : filename,
       email : email,
       themes : themes
   }, function(err, item) {

       if (err){
           res.send(err);
       }

       Company.find(function(err, companies) {

           if (err){
               res.send(err);
           }

           res.json(companies);

       });

   });

}

exports.updateCompanies = function(req, res, next){
    
    var companyname = req.body.company;
    
    console.log("Updating Company Profile:" + companyname);
    if(!companyname){
        return res.status(422).send({error: 'You must enter a company name'});
    }

    Company.findOne({companyname: companyname},function(err, company) {
        
               if (err){
                   return next(err);
               }
        

               if(!company){
                return res.status(422).send({error: 'Cannot find your company.'});
                }

                console.log("Found company and updating");

                company.companyname = req.body.companyname;
                company.companydescription = req.body.companydescription;
                company.email = req.body.email;
                company.filename = req.body.filename;
                company.themes = req.body.themes;

                company.save(function(err, company){
    
                if(err){
                    return next(err);
                }
    
                //var userInfo = setUserInfo(user);
        
                res.status(201).json({
                    company: company
                })
    
                });
        
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

exports.deleteCompany = function(req, res, next){

   Company.remove({
       _id : req.params.company_id
   }, function(err, company) {
       res.json(company);
   });
}

exports.getCompanyByName = function(req,res,next){
    console.log("Before:" + req.params.companyname);
    var companyname = decodeURI(req.params.companyname);
    console.log("After: " + companyname);
    Company.findOne({companyname: companyname}, function(err, existingCompany){
    
            if(err){
                return next(err);
            }
    
            if(!existingCompany){
                return res.status(422).send({error: 'Cannot find this company, this company does not exist'});
            }


            res.status(201).json({
                company: existingCompany
            })
            //res.json(existingCompany); 

        });
}
