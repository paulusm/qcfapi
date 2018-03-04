var mongoose = require('mongoose');


var AreaSchema = new mongoose.Schema({area:String});

module.exports = mongoose.model('SubTheme', AreaSchema);