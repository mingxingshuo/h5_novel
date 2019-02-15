var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var UserSchema = new Schema({
    openid: String,
    nickname: String,
    unionid: String,
    sex: String,
    province: String,
    city: String,
    country: String,
    headimgurl: String,
    action_time: Number,
    tag_sex:Number,
    shelf: Array,
    pay_chapter: Array,
    isvip: {type: Number, default: 0}, //用户是否VIP，1是，0不是
    balance:{type: Number, default: 0},//余额
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: {createdAt: 'createAt', updatedAt: 'updateAt'}
});


var UserModel = DB.getDB().model('User', UserSchema);

module.exports = UserModel;