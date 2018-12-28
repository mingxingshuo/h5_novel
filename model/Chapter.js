var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(DB.getDB());

var ChapterSchema = new Schema({
    title: String,
    content: String,
    isvip: String,
    bid: Number,  //书id
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

ChapterSchema.plugin(autoIncrement.plugin, {
    model: 'Chapter',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

var ChapterModel = DB.getDB().model('Chapter', ChapterSchema);

module.exports = ChapterModel;