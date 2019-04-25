var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var BookPayRuleSchema = new Schema({
    bid: Number,
    price: Number,
    start: Number,
    end: Number,
    start_index:Number,
    end_index:Number
});

var BookPayRuleModel = DB.getDB().model('BookPayRule', BookPayRuleSchema);

module.exports = BookPayRuleModel;