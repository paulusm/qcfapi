var mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema({
    name: String,
    subThemes:{type:[AreaSchema],required:false}
});

var AreaSchema = new Schema({area:String});

module.exports = mongoose.model('Theme', ThemeSchema);