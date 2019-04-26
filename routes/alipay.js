const router = require('koa-router')()
const request = require('request')
const crypto = require("crypto");
const fs = require('fs');
const xml2js = require("xml2js");
const builder = new xml2js.Builder();
const parser = new xml2js.Parser();
const OrderModel = require('../model/Order')
const BookPayRuleModel = require('../model/BookPayRule');
const AlipaySdk = require('alipay-sdk').default
const AliPayForm = require('alipay-sdk/lib/form').default
const mem = require("../util/mem")

const alipaySdk = new AlipaySdk({
    appId: '2019042264267313',
    privateKey: fs.readFileSync('./conf/private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('./conf/public-key.pem', 'ascii'),
});

router.prefix('/alipay')

router.get('/', async function (ctx, next) {
    let rid = ctx.request.query.rid
    let distribution = ctx.request.query.distribution
    let uid = ctx.request.query.uid
    let back_url= ctx.request.query.back
    let rule = await mem.get("h5_novel_rule_" + rid);
    if(rule) {
        rule = JSON.parse(rule)
    }else{
        rule = await BookPayRuleModel.findById(rid)
        await mem.set("h5_novel_rule_" + rid, JSON.stringify(rule), 90)
    }
    let doc = await OrderModel.create({
        u_id: uid,
        bid: rule.bid,
        rid: rid,
        distribution: distribution,
        total_fee: rule.price,
        type: 2
    })
    const formData = new AliPayForm();
    formData.addField('notifyUrl', 'http://p.rrtvz.com/alipay/back');
    formData.addField('returnUrl', 'http://p.rrtvz.com/alipay/success?back=' + back_url);
    formData.addField('bizContent', {
        outTradeNo: doc._id.toString(),
        productCode: 'FAST_INSTANT_TRADE_PAY',//QUICK_WAP_WAY
        totalAmount: rule.price,
        subject: '黑牛全本小说',
        quitUrl: 'http://p.rrtvz.com/alipay/fail?back=' + back_url
    });

    let result = await alipaySdk.pageExec("alipay.trade.wap.pay",
        {
            formData: formData
        })
    return ctx.render('pay/index', {content: result})
})

router.post('/back', async function (ctx, next) {
    var buf = "";
    ctx.req.setEncoding('utf8');
    ctx.req.on('data', function (chunk) {
        buf += chunk;
    });
    ctx.req.on('end', function () {
        buf = buf.replace('undefined', '');
        console.log(buf,'---------------buf')
        parser.parseString(buf, function (err, data) {
            console.log(data, '---------------data')
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
    let out_trade_no = data.xml.out_trade_no[0]
    let trade_status = data.xml.trade_status[0]
    if (trade_status == "TRADE_SUCCESS") {
        await OrderModel.findOneAndUpdate({_id: out_trade_no}, {
            status: 1,
            updateAt: Date.now()
        })
    }
}

router.get('/success', async function (ctx, next) {
    let url = ctx.request.query.back
    return ctx.redirect(url)
})

router.get('/fail', async function (ctx, next) {
    let url = ctx.request.query.back
    return ctx.redirect(url)
})

module.exports = router