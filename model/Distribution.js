var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var DistributionSchema = new Schema({
    title:{
      type: String,
      default: ''
    },//广告位名称
    adzones:Object,//接入广告配置
    /*code:{
            platform:String,//广告平台
            adkey:String
    }*/
    official:{//公众号配置
    	image:{
    	  type: String,
        default: ''
      },
    	name : {
        type: String,
        default: ''
      }
    }

});

var DistributionModel = DB.getDB().model('Distribution', DistributionSchema);

module.exports = DistributionModel;