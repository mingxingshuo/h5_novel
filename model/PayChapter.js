var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var PayChapterSchema = new Schema({
    u_id: String,
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

var PayChapterModel = DB.getDB().model('PayChapter', PayChapterSchema);

module.exports = PayChapterModel;