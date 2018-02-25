var mongoose = require('mongoose');

var FileSchema = new mongoose.Schema({

   fileName: {
       type: String,
       required: true
   },
   file: {
       type: String,
       required: true
   },
   companyid: {
       type: String,
       required: true
   }

}, {
   timestamps: true
});

module.exports = mongoose.model('File', FileSchema);