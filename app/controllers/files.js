var mongoose = require('mongoose');
var File = require('../models/file');
var multer = require('multer');
var databaseConfig = require('../../config/database');
mongoose.connect(databaseConfig.url);
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
var gfs = Grid(mongoose.connection.db);

var storage = GridFsStorage({
    gfs : gfs,
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    },
    /** With gridfs we can store aditional meta-data along with the file */
    metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'ctFiles' //root name for collection to store files into
});

var upload = multer({ //multer settings for single upload
    storage: storage
}).single('file');

var gfilename;

exports.getFile = function(req, res){

    console.log("Retrieving Image File: " + req.params.filename );
    
    gfs.collection('ctFiles'); //set collection name to lookup into
    

        /** First check if file exists */
        gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
            if(!files || files.length === 0){
                return res.status(404).json({
                    responseCode: 1,
                    responseMessage: "error"
                });
            }
            /** create read stream */
            var readstream = gfs.createReadStream({
                filename: files[0].filename,
                root: "ctFiles"
            });
            /** set the proper content type */
            res.set('Content-Type', files[0].contentType)
            /** return response */
            return readstream.pipe(res);
        });

}

exports.getFiles = function(req, res, next){
    
    gfs.collection('ctFiles.files'); //set collection name to lookup into
       gfs.find(function(err, files) {
    
           if (err){
               res.send(err);
           }
    
           res.json(files);
    
       });
    
    }

exports.createFile = function(req, res, next){
console.log("createFile Running");
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         lfilename = req.file.filename;
         res.json({filename:lfilename,error_code:0,err_desc:null});
    });
    console.log("createFile Finished");
    
}

exports.deleteFile = function(req, res, next){

   File.remove({
       _id : req.params.file_id
   }, function(err, file) {
       res.json(file);
   });

}