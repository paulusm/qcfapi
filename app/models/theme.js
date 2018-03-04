var mongoose = require('mongoose');

var ThemeSchema = new mongoose.Schema(
    {
    name:{type:String},
    subThemes:{type:[SubTheme],required:false}
});



module.exports = mongoose.model('Theme', ThemeSchema);