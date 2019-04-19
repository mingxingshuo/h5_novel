const router = require('koa-router')()
const request = require('request')
const crypto = require("crypto");
const xml2js = require("xml2js");
const builder = new xml2js.Builder();
const parser = new xml2js.Parser();
const OrderModel = require('../model/Order')
const PayBookModel = require("../model/PayBook")

router.prefix('/pay')

router.get('/', async function (ctx, next) {
    let bid = ctx.request.query.bid
    let u_id = ctx.id
    let appid = "wxd5d2f830fbcd609c"
    let body = "黑牛全本小说"
    let mch_id = "1527118561"
    let nonce_str = rand()
    let notify_url = "http://n.tyuss.com/pay/back"
    let spbill_create_ip = "39.106.138.15"
    // let price = ctx.request.query.price
    // let total_fee = parseInt(ctx.request.query.price * 100)
    let price = 0.01
    let total_fee = 1
    let trade_type = "MWEB"
    let doc = await OrderModel.create({u_id: u_id, bid: bid})
    let out_trade_no = doc._id
    let str = "appid=" + appid + "&body=" + body + "&mch_id=" + mch_id + "&nonce_str=" + nonce_str + "&notify_url=" + notify_url + "&out_trade_no=" + out_trade_no + "&spbill_create_ip=" + spbill_create_ip + "&total_fee=" + total_fee + "&trade_type=" + trade_type + "&key=dK98AAMOJeCbqaIoCGkRJrKitN1HBfQW"
    let sign = md5(str)
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
    console.log(param, '-----------------param')
    let result = await req(param)
    console.log(result, '-----------------result')
    let mweb_url = result.xml.mweb_url[0];
    ctx.redirect(mweb_url)
})

router.post('/back', async function (ctx, next) {
    var buf = "";
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', function (chunk) {
        buf += chunk;
    });
    ctx.req.on('end', function () {
        buf = buf.replace('undefined', '');
        parser.parseString(buf, function (err, data) {
            if (err) {
                console.log(err, ' 订单返回错误');
            } else {
                if (data.xml) {
                    balan(data).then(() => {
                        console.log('订单处理成功');

                    })
                } else {
                    console.log('订单返回错误');
                }
            }
        });
    });
    ctx.body = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
})

async function balan(data) {
    let order = await OrderModel.findOneAndUpdate({_id: data.xml.out_trade_no[0]}, {
        status: 1,
        updateAt: Date.now()
    }, {new: true})
    if (order.total_fee == 30) {
        await PayBookModel.create({u_id: order.u_id, bid: order.bid})
    } else if (order.total_fee == 0.01) {
        await PayBookModel.create({u_id: order.u_id, bid: order.bid})
    }
}

function rand() {
    var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var rand = '';
    for (var i = 0; i < 32; i++) {
        rand += s.substr(parseInt(Math.random() * 36), 1);
    }
    return rand;
}

function md5(str) {
    let md5 = crypto.createHash('md5');
    md5.update(str, "utf8");
    str = md5.digest('hex');
    let sign = str.toUpperCase();
    return sign
}

function req(param) {
    return new Promise((resolve, reject) => {
        request.post({url: 'https://api.mch.weixin.qq.com/pay/unifiedorder', body: param}, function (err, res, data) {
            parser.parseString(data, function (err1, result) {
                console.log(result, '------------------result')
                resolve(result)
            })
        })
    })
}

module.exports = router