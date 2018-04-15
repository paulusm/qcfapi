var mongoose = require('mongoose');

var StorySchema = new mongoose.Schema({

   storytitle: {
    type: String,
    required: true
   },
   story: {
    type: String,
    required: true
   },
   themeid: {
    type: String,
    required: false
   },
   imagepath: {
    type: String,
    required: false
   },
   storyauthor: {
    type: String,
    required: true
   },
   publisheddate: {
    type: Date,
    required: false
   },
   likes: {
    type:[String],
    required:false
   },
   type: {
    type: String,
    enum: ['Article','News','Story'],
    default: 'Article'
   },
   approved:{
       type:Boolean,
       required:true,
       default:false
   },
   companyid:{
       type:String,
       required:true
   }
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Story', StorySchema);
