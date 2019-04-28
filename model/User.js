var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var UserSchema = new Schema({
    tag_sex: Number,
    shelf: Array,
    openid:String,
    distribution:String,//渠道key
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