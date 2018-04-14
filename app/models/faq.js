var mongoose = require('mongoose');

var FaqSchema = new mongoose.Schema({

   faqtitle: {
    type: String,
    required: true
   },
   faq: {
    type: String,
    required: true
   },
   companyid: {
    type: String,
    required: true
   },
   imagepath: {
    type: String,
    required: false
   }
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Faq', FaqSchema);
