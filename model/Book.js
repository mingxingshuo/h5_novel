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
    zishu: {type: Number, default: 0},
    zhishu: {type: Number, default: 0},
    xstype:{type: Number, default: 0}, //小说状态 0连载中，1已完结
    status:{type: Number, default: 0}, //0未上架，1上架
    sex:{type: Number, default: 2}, //1女，2男
    xianmian_start: Number,  //限免开始时间
    xianmian_end: Number,  //限免结束时间
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