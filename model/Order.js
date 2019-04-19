var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(DB.getDB());

var OrderSchema = new Schema({
    u_id: String,
    bid: Number,
    total_fee: Number,
    order_number: Number,
    status: {type: Number, default: 0}, //订单是否支付，1是，0不是
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

var OrderModel = DB.getDB().model('Order', OrderSchema);

module.exports = OrderModel;