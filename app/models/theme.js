var mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema({

    name: {
        type:String
    },
    areas: [String]
});



module.exports = mongoose.model('Theme', ThemeSchema);