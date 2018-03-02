var Event = require('../models/company');

//Get all companies from database
exports.getCompanies = function(req, res, next){

   Company.find(function(err, companies) {

       if (err){
           res.send(err);
       }

       res.json(companies);

   });

}

//Find and return a specific company by $oid
exports.getCompanyByCompanyID = function(req, res, next){
    var company_id = req.params.company_id;
    Company.findOne({company_id: company_id}, function(err, existingCompany){
    
           if(err){
               return next(err);
           }
    
           if(existingCompany){
               return res.status(201).json({
                   company_id:company_id,
                   company:existingCompany
                });
           }
    });
}


exports.updateCompanies = function(req, res, next){
    Company.find(function(err, companies) {
        
               if (err){
                   res.send(err);
               }
        
               res.json(companies);
        
           });
}

exports.createCompany = function(req, res, next){

   Company.create({
       companyname : req.body.companyname,
       companydescription : req.body.companydescription,
       filename : req.body.filename,
       email : req.body.email
   }, function(err, company) {

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

exports.deleteCompany = function(req, res, next){

   Company.remove({
       _id : req.params.company_id
   }, function(err, company) {
       res.json(company);
   });

}