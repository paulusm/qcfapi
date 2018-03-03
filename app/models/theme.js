var mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema({
    name: String,
    areaname: String,
    subject:String,
    companyname:String,
    selected:String


});

module.exports = mongoose.model('Theme', ThemeSchema);