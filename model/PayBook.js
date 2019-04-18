var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var PayBookSchema = new Schema({
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

var PayBookModel = DB.getDB().model('PayBook', PayBookSchema);

module.exports = PayBookModel;