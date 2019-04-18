var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var UserShelfSchema = new Schema({
    u_id: String,
    bid: Number,
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

var UserShelfModel = DB.getDB().model('UserShelf', UserShelfSchema);

module.exports = UserShelfModel;