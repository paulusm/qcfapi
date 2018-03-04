var mongoose = require('mongoose');

var CompanySchema = new mongoose.Schema({

   companyname: {
       type: String,
       required: true
   },
   companydescription: {
       type: String,
       required: true
   },
   filename: {
       type: String,
       required: true
   },
   email: {
       type: String,
       required: true
   },
   themes: {
       type:mongoose.Schema.Types.ObjectId,
       ref:'Theme',
       required:false
   }

}, {
   timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);