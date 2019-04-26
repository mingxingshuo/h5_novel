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

const alipaySdk = new AlipaySdk({
    appId: '2019042264267313',
    privateKey: fs.readFileSync('./conf/private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('./conf/public-key.pem', 'ascii'),
});

router.prefix('/alipay')

router.get('/', async function (ctx, next) {
    let bid = ctx.request.query.bid
    let rid = ctx.request.query.rid
    let distribution = ctx.request.query.distribution
    let total_fee = ctx.request.query.price
    let uid = ctx.request.query.uid
    let doc = await OrderModel.create({
        u_id: uid,
        bid: bid,
        rid: rid,
        distribution: distribution,
        total_fee: total_fee,
        type: 2
    })
    const formData = new AliPayForm();
    formData.addField('notifyUrl', 'http://p.rrtvz.com/alipay/back');
    formData.addField('returnUrl', 'http://p.rrtvz.com/alipay/success?rid=' + rid);
    formData.addField('bizContent', {
        outTradeNo: doc._id.toString(),
        productCode: 'FAST_INSTANT_TRADE_PAY',//QUICK_WAP_WAY
        totalAmount: total_fee,
        subject: '黑牛全本小说',
        quitUrl: 'http://p.rrtvz.com/alipay/fail?rid=' + rid
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
        parser.parseString(buf, function (err, data) {
            console.logA(data, '---------------data')
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
    let rid = ctx.request.query.rid
    let rule = await BookPayRuleModel.findById(rid)
    return ctx.redirect('http://www.tyuss.com/content?bid=' + rule.bid + '&id=' + rule.start)
})

router.get('/fail', async function (ctx, next) {
    let rid = ctx.request.query.rid
    let rule = await BookPayRuleModel.findById(rid)
    return ctx.redirect('http://www.tyuss.com/content?bid=' + rule.bid + '&id=' + rule.start)
})

module.exports = router