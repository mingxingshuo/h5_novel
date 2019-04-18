var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var UserSchema = new Schema({
    tag_sex: Number,
    shelf: Array,
    isvip: {type: Number, default: 0}, //用户是否VIP，1是，0不是
    vip_time: Number, //用户购买VIP时间
    balance: {type: Number, default: 0},//余额
    channel:Number,
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
    fetch(id, cb){
        if (id) {
            return this.find({_id: {$lt: id}, isvip: 1}, ['unionid', 'vip_time'])
                .limit(1000)
                .sort({'_id': -1})
                .exec(cb);
        } else {
            return this.find({isvip: 1}, ['unionid', 'vip_time'])
                .limit(1000)
                .sort({'_id': -1})
                .exec(cb);
        }
    }
}

var UserModel = DB.getDB().model('User', UserSchema);

module.exports = UserModel;