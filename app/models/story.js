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
   thememid: {
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
   }
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Story', StorySchema);
