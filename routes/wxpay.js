const router = require('koa-router')()
const request = require('request')
const crypto = require("crypto");
const xml2js = require("xml2js");
const builder = new xml2js.Builder();
const parser = new xml2js.Parser();
const OrderModel = require('../model/Order')
const BookPayRuleModel = require('../model/BookPayRule');
const wx_conf = require('../conf/proj.json')

router.get('/', async function (ctx, next) {
    let rid = ctx.request.query.rid
    let distribution = ctx.request.query.distribution
    let uid = ctx.request.query.uid
    let appid = wx_conf.appid
    let body = "黑牛全本小说"
    let mch_id = "1527118561"
    let nonce_str = rand()
    let js_nonce_str = rand()
    let notify_url = "http://p.rrtvz.com/wxpay/back"
    let spbill_create_ip = "39.106.138.15"
    let total_fee = ctx.request.query.price * 100
    let trade_type = "JSAPI"
    let rule = await mem.get("h5_novel_rule_" + rid);
    if (rule) {
        rule = JSON.parse(rule)
    } else {
        rule = await BookPayRuleModel.findById(rid)
        await mem.set("h5_novel_rule_" + rid, JSON.stringify(rule), 90)
    }
    let doc = await OrderModel.create({
        u_id: uid,
        bid: rule.bid,
        rid: rid,
        distribution: distribution,
        total_fee: rule.price,
        type: 3
    })
    let out_trade_no = doc._id.toString()
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
    let pack = "prepay_id=" + result.xml.prepay_id[0];
    console.log(result, '-----------------result')
    let timeStamp = Date.now() / 1000
    let js_str = "appId=" + appid + "&nonceStr=" + js_nonce_str + "&package=" + pack + "&signType=MD5" + "&timeStamp=" + timeStamp + "&key=dK98AAMOJeCbqaIoCGkRJrKitN1HBfQW";
    let js_sign = md5(js_str)
    return ctx.render = ('pay/wxpay', {
        "appid": appid,
        "timeStamp": timeStamp,
        "nonceStr": js_nonce_str,
        "package": pack,
        "signType": "MD5",
        "paySign": js_sign
    })
})

router.post('/back', async function (ctx, next) {
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
                    await OrderModel.findOneAndUpdate({_id: data.xml.out_trade_no[0]}, {
                        status: 1,
                        updateAt: Date.now()
                    })
                } else {
                    console.log('订单返回错误');
                }
            }
        });
    });
    ctx.body = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
})

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