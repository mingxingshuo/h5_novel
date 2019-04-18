var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var DistributionStaticSchema = new Schema({
    distribution:String,
    date:Number,
    uv:Number
});

var DistributionStaticModel = DB.getDB().model('DistributionStatic', DistributionStaticSchema);

module.exports = DistributionStaticModel;