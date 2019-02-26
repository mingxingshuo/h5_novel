var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var RecordSchema = new Schema({
    unionid: String,
    bid: Number,
    cid: Number,
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


var RecordModel = DB.getDB().model('Record', RecordSchema);

module.exports = RecordModel;