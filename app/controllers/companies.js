var Event = require('../models/company');

exports.getCompanies = function(req, res, next){

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
       logopath : req.body.logopath,
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