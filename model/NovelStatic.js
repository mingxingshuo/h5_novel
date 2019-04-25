var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var NovelStaticsSchema = new Schema({
    distribution:String,
    bid:Number,
    date:Number,
    uv:Number,
    pv:Number,
    deposit:Number,
    type:String
});

var NovelStaticModel = DB.getDB().model('NovelStatic', NovelStaticSchema);

module.exports = NovelStaticModel;