var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var QudaoSchema = new Schema({
    name: String,
    bookId: Number,  //书id
    bookName: String,
    chapterId: Number,  //章节id
    chapterName: String,
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

var QudaoModel = DB.getDB().model('Qudao', QudaoSchema);

module.exports = QudaoModel;