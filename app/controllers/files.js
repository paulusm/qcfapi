var File = require('../models/file');

exports.getFiles = function(req, res, next){

   File.find(function(err, files) {

       if (err){
           res.send(err);
       }

       res.json(files);

   });

}

exports.getHome = function(req,res,next){
// render the index page, and pass data to it.
    res.render('routes', {title:'Express'});

}

exports.uploadFile = function(req, res, next) {
    var path = '';
    upload(req, res, function (err) {
       if (err) {
         // An error occurred when uploading
         console.log(err);
         return res.status(422).send("an Error occured")
       }  
      // No error occured.
       path = req.file.path;
       return res.send("Upload Completed for "+path); 
});
}

exports.createFile = function(req, res, next){

   File.create({
       companyid : req.body.companyid,
       fileName : req.body.filename,
       file : req.body.file
   }, function(err, file) {

       if (err){
           res.send(err);
       }

       File.find(function(err, files) {

           if (err){
               res.send(err);
           }

           res.json(files);

       });

   });

}

exports.deleteFile = function(req, res, next){

   File.remove({
       _id : req.params.file_id
   }, function(err, file) {
       res.json(file);
   });

}