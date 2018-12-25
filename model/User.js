var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var UserSchema = new Schema({
  openid: String,
  nickname: String,
  unionid:String,
  sex: String,
  province: String,
  city: String,
  country: String,
  headimgurl: String,
  action_time:Number,
  createAt: {
      type: Date,
      default: Date.now
  },
  updateAt: {
      type: Date,
      default: Date.now
  }
},{
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
});


var UserModel = DB.getDB().model('User', UserSchema);

module.exports = UserModel;