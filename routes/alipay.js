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
    let back_url = ctx.request.query.back
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
        type: 2
    })
    const formData = new AliPayForm();
    formData.addField('notifyUrl', 'http://p.rrtvz.com/alipay/back');
    formData.addField('returnUrl', 'http://p.rrtvz.com/alipay/success?back=' + encodeURIComponent(back_url));
    formData.addField('bizContent', {
        outTradeNo: doc._id.toString(),
        productCode: 'FAST_INSTANT_TRADE_PAY',//QUICK_WAP_WAY
        totalAmount: rule.price,
        subject: '黑牛全本小说',
        quitUrl: 'http://p.rrtvz.com/alipay/fail?back=' + encodeURIComponent(back_url)
    });

    let result = await alipaySdk.pageExec("alipay.trade.wap.pay",
        {
            formData: formData
        })
    return ctx.render('pay/index', {content: result})
})

router.post('/back', async function (ctx, next) {
    if (ctx.request.body) {
        let out_trade_no = ctx.request.body.out_trade_no
        let trade_status = ctx.request.body.trade_status
        if (trade_status == "TRADE_SUCCESS") {
            await OrderModel.findOneAndUpdate({_id: out_trade_no}, {
                status: 1,
                updateAt: Date.now()
            })
            console.log('订单处理成功');
        }
    } else {
        console.log('订单返回错误');
    }
    ctx.body = ''
})

router.get('/success', async function (ctx, next) {
    let url = decodeURIComponent(ctx.request.query.back)
    console.log('----success url-----')
    console.log(url)
    return ctx.redirect(url)
})

router.get('/fail', async function (ctx, next) {
    let url = decodeURIComponent(ctx.request.query.back)
    console.log('----fail url-----')
    console.log(url)
    return ctx.redirect(url)
})

module.exports = router