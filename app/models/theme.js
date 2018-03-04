var mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema({

    name: {
        type:String
    },
    areas: [AreaSchema]
});



module.exports = mongoose.model('Theme', ThemeSchema);