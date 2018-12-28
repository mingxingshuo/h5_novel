var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(DB.getDB());

var BookSchema = new Schema({
    title: String,
    zuozhe: String,
    desc: String,
    image:String,
    zishu: String,
    zhuishu: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: { createdAt: 'createAt', updatedAt: 'updateAt' }
});

BookSchema.plugin(autoIncrement.plugin, {
    model: 'Book',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

var BookModel = DB.getDB().model('Book', BookSchema);

module.exports = BookModel;