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
    sign: {type: Number, default: 0},          //标记
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

UserSchema.statics = {
    fetch_openid(id, code, cb){
        if (id) {
            return this.find({_id: {$lt: id}, code: code, sign: {$ne: 1}, subscribe_flag: true}, ['openid'])
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        } else {
            return this.find({code: code, sign: {$ne: 1}, subscribe_flag: true}, ['openid'])
                .limit(50)
                .sort({'_id': -1})
                .exec(cb);
        }
    }
}


var UserModel = DB.getDB().model('User', UserSchema);

module.exports = UserModel;