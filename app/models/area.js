var Area = require('./area.js');
var mongoose = require('mongoose');


var AreaSchema = new mongoose.Schema({
    area: {
        type:String
    }
});

module.exports = mongoose.model('Area', AreaSchema);