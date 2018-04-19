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
        type: [String],
        enum: ['Volunteering','Sponsorship','Other'],
        default: 'Other'
    },
    donationmatch: {
        type: Number,
        required: false,
        default:0
    },
    approved: {
        type:Boolean,
        required:false,
        default:false
    },
    companyid:{
        type:String,
        required:true
    },
    enddate: {
        type:Date,
        required: false
    },
    startdate: {
        type:Date,
        required:false
    },
    mydonateurl: {
        type:String,
        required:false
    },
    likes: {
        type:[String],
        required:false
    },
    volunteers: {
        type:[String],
        required:false
    },
    sponsors: {
        type:[String],
        required:false
    },
    location:{
        type:String,
        required:false
    },
    address: {
        type:String,
        required:false
    },
    filename: {
        type:String,
        required:false
    }, 
    targetamount: {
        type: Number,
        required :false
    },
    totalamount: {
        type:Number,
        required:false
    },
    feedback: {
        type:String,
        required:false
    },
    status: {
        type: [String],
        enum: ['Open','Closed','Deleted'],
        default: 'Open'
    },
    targethours: {
        type:Number,
        required:false
    },
    totalhours: {
        type:Number,
        required:false
    }


 
}, {
    timestamps: true
});
 
module.exports = mongoose.model('Activity', ActivitySchema);