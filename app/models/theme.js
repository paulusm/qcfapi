var mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema({

    name: {
        type:String
    },
    areas: {
        type:[String],
        required:false
    }
});



module.exports = mongoose.model('Theme', ThemeSchema);