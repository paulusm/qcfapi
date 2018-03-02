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
   }

}, {
   timestamps: true
});

module.exports = mongoose.model('Company', CompanySchema);