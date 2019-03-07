var mongoose = require('mongoose');
//mongoose.set('debug', true); 
var Schema = mongoose.Schema;
var DB = require('./DB');

var OrderSchema = new Schema({
    u_id: String,
    total_fee: String,
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

OrderSchema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'order_number',
    startAt: 1000000001,
    incrementBy: 1
});

var OrderModel = DB.getDB().model('Order', OrderSchema);

module.exports = OrderModel;