var File = require('../models/file');

exports.getFiles = function(req, res, next){

   File.find(function(err, files) {

       if (err){
           res.send(err);
       }

       res.json(files);

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