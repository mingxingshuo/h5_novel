var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var QudaoSchema = new Schema({
    name: String,
    bookId: Number,  //书id
    chapterId: Number,  //章节id
    run:{type: Number, default: 0}, //0未运行，1运行
    linkUrl:String,
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