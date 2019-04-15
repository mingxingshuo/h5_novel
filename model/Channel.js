var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var ChannelSchema = new Schema({
    name: String,
    bookId: Number,  //书id
    bookName: String, //书名
    chapterId: Number,  //章节id
    chapterName: String, //章节名
    sex: {type: Number, default: 2}, //1女，2男
    run: {type: Number, default: 0}, //0未启用，1启用
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

var ChannelModel = DB.getDB().model('Channel', ChannelSchema);

module.exports = ChannelModel;