const router = require('koa-router')()
const request = require('request')
const crypto = require("crypto");
const xml2js = require("xml2js");
const builder = new xml2js.Builder();
const parser = new xml2js.Parser();
const OrderModel = require('../model/Order')
const UserModel = require('../model/User')

router.prefix('/pay')

router.get('/', async function (ctx, next) {
    let u_id = ctx.request.query.u_id
    let appid = "wxd5d2f830fbcd609c"
    let body = "黑牛全本小说"
    let mch_id = "1527118561"
    let nonce_str = rand()
    let notify_url = "http://n.tyuss.com/pay/back"
    let spbill_create_ip = "39.106.138.15"
    let price = ctx.request.query.price
    let total_fee = ctx.request.query.price * 100
    let trade_type = "APP"
    let data = {
        u_id: u_id,
        total_fee: price
    }
    let doc = await OrderModel.create(data)
    let out_trade_no = doc.order_number
    let str = "appid=" + appid + "&body=" + body + "&mch_id=" + mch_id + "&nonce_str=" + nonce_str + "notify_url=" + notify_url + "&out_trade_no=" + out_trade_no + "&spbill_create_ip=" + spbill_create_ip + "&total_fee=" + total_fee + "&trade_type=" + trade_type + "&key=rJV1FTkxjorutBpbxAjfYK2Mm70AuokQ"
    let md5 = crypto.createHash('md5');
    md5.update(str, "utf8");
    str = md5.digest('hex');
    let sign = str.toUpperCase();
    let send_data = {
        appid: appid,
        body: body,
        mch_id: mch_id,
        nonce_str: nonce_str,
        notify_url: notify_url,
        out_trade_no: out_trade_no,
        spbill_create_ip: spbill_create_ip,
        total_fee: total_fee,
        trade_type: trade_type,
        sign: sign
    }
    let param = builder.buildObject(send_data);
    // console.log(param, '-------------------------result');
    request.post({url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', body: param}, function (err, res, data) {
        console.log(err, res, data, '-------------------------result1');
        parser.parseString(data.text, function (err1, result) {
            // console.log(err1, result, '-------------------------result2');
            ctx.body = {success: '成功'}
        });
    })
})

router.get('/back', function (ctx, next) {
    var buf = "";
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', function (chunk) {
        buf += chunk;
    });
    ctx.req.on('end', function () {
        buf = buf.replace('undefined', '');
        parser.parseString(buf, async function (err, data) {
            if (err) {
                console.log(err, ' 订单返回错误');
            } else {
                if (data.xml) {
                    let order = await OrderModel.findOneAndUpdate({order_number: data.xml.out_trade_no[0]}, {
                        status: 1,
                        updateAt: Date.now()
                    }, {new: true})
                    if (order.total_fee == 30) {
                        await UserModel.findOneAndUpdate({_id: order.u_id}, {$inc: {balance: 3000}})
                    } else if (order.total_fee == 50) {
                        await UserModel.findOneAndUpdate({_id: order.u_id}, {$inc: {balance: 8000}})
                    } else if (order.total_fee == 100) {
                        await UserModel.findOneAndUpdate({_id: order.u_id}, {$inc: {balance: 18000}})
                    } else if (order.total_fee == 200) {
                        await UserModel.findOneAndUpdate({_id: order.u_id}, {$inc: {balance: 40000}})
                    } else if (order.total_fee == 365) {
                        await UserModel.findOneAndUpdate({_id: order.u_id}, {isvip: 1, vip_time: new Date()})
                    } else if (order.total_fee == 0.01) {
                        await UserModel.findOneAndUpdate({_id: order.u_id}, {$inc: {balance: 100}})
                    }
                    ctx.body = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>"
                } else {
                    console.log('订单返回错误');
                }
            }
        });
    });
})

function rand() {
    var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var rand = '';
    for (var i = 0; i < 32; i++) {
        rand += s.substr(parseInt(Math.random() * 36), 1);
    }
    return rand;
}

module.exports = router