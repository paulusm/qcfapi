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
    
    console.log("Registering New Company");


   Company.create({
       companyname : companyname,
       companydescription : companydescription,
       filename : filename,
       email : email
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
    Company.find(function(err, companies) {
        
               if (err){
                   res.send(err);
               }
        
               res.json(companies);
        
           });
}

exports.deleteCompany = function(req, res, next){

   Company.remove({
       _id : req.params.company_id
   }, function(err, company) {
       res.json(company);
   });

}