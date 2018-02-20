var mongoose = require('mongoose');
 
var EventSchema = new mongoose.Schema({
 
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    icon: {
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
 
module.exports = mongoose.model('Event', EventSchema);