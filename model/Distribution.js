var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var DistributionSchema = new Schema({
    adzone:{//接入广告配置
    	key:String
    },
    official:{//公众号配置
    	image:String,
    	name : String
    }

});

var DistributionModel = DB.getDB().model('Distribution', DistributionSchema);

module.exports = DistributionModel;