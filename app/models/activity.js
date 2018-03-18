var mongoose = require('mongoose');
 
var ActivitySchema = new mongoose.Schema({
 
    activityname: {
        type: String,
        required: true
    },
    activitydescription: {
        type: String,
        required: true
    },
    activityowner: {
        type: String,
        required: true
    },
    activitytype: {
        type: String,
        enum: ['Volunteering','Sponsorship','Other'],
        default: 'Other'
    },
    donationmatch: {
        type: Number,
        required: false,
        default:0
    },
    approved: {
        type:boolean,
        required:false,
        default:false
    },
    companyid:{
        type:String,
        required:true
    }

 
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Activity', ActivitySchema);