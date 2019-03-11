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
    let total_fee = parseInt(ctx.request.query.price * 100)
    let trade_type = "APP"
    let data = {
        u_id: u_id,
        total_fee: price
    }
    let doc = await OrderModel.create(data)
    let out_trade_no = doc.order_number
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
    let result = await req(param)
    console.log(result, '-----------------aaa')
    var prepay_id = result.xml.prepay_id[0];
    var h5_nonce_str = rand();
    let timeStamp = Date.parse(new Date()) / 1000;
    let str1 = "appid=" + appid + "&noncestr=" + nonce_str + "&package=Sign=WXPay&partnerid=" + mch_id + "&prepayid=" + prepay_id + "&timestamp=" + timeStamp + "&key=dK98AAMOJeCbqaIoCGkRJrKitN1HBfQW"
    console.log(str1)
    let paySign = md5(str1)
    ctx.body = {
        "appid": appid,
        "timeStamp": timeStamp,
        "nonceStr": nonce_str,
        "prepay_id": prepay_id,
        "signType": "MD5",
        "paySign": paySign,
        "str1" :str1
    }
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
                console.log(data, '-----------------data')
                if (data.xml) {
                    balan(data).then(()=>{
                            console.log('----------------------aaaaaaaa')
                            var result="<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>"
                            //ctx.res.setHeader('Content-Type', 'application/xml')
                            ctx.response.type = 'xml';
                            ctx.response.body =result;        
                    })
                } else {
                    console.log('订单返回错误');
                }
            }
        });
    });
})

async function balan(data){
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