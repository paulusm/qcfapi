var mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema({

    name: {
        type:String
    },
    areas: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Area',
        required:false
    }]
});



module.exports = mongoose.model('Theme', ThemeSchema);