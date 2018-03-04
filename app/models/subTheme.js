var mongoose = require('mongoose');


var AreaSchema = new Schema({area:String});

module.exports = mongoose.model('SubTheme', AreaSchema);