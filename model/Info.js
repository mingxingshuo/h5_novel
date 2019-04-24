var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var InfoSchema = new Schema({
    bid: Number,
    book_title: String,
    url: String,
    title: String,
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

var InfoModel = DB.getDB().model('Info', InfoSchema);

module.exports = InfoModel;