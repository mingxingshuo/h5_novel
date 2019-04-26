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
const alipaySdk = new AlipaySdk({
    appId: 2019042264267313,
    privateKey: fs.readFileSync('./conf/private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('./conf/public-key.pem', 'ascii'),
});

router.prefix('/alipay')

router.get('/', async function (ctx, next) {
    let bid = ctx.request.query.bid
    let distribution = ctx.request.query.distribution
    let total_fee = ctx.request.query.price
    let u_id = 'xxx'
    let rule = BookPayRuleModel.findOne({bid: bid, price: total_fee})
    let doc = await OrderModel.create({
        u_id: u_id,
        bid: bid,
        rid: rule._id,
        distribution: distribution,
        total_fee: total_fee,
        type: 2
    })
    try {
        let result = await alipaySdk.exec("alipay.trade.wap.pay", {
            notifyUrl: 'http://p.rrtvz.com/alipay/back',
            returnUrl:'http://p.rrtvz.com/alipay/content',
            appAuthToken: '',
            // sdk 会自动把 bizContent 参数转换为字符串，不需要自己调用 JSON.stringify
            bizContent: {
                subject: encodeURIComponent('黑牛全本小说'),
                outTradeNo: doc._id.toString(),
                totalAmount: total_fee,
                productCode: 'QUICK_WAP_WAY',
                quitUrl:'http://p.rrtvz.com/alipay/content'
            },
        }, {
            // 验签
            validateSign: true,
            // 打印执行日志
            log: this.logger,
        })
        console.log(result, '-------------------result');
    } catch (err) {
        console.log(err,'-----------------------err')
    }
    // ctx.redirect("https://openapi.alipay.com/gateway.do")
})

router.post('/back', async function (ctx, next) {
    console.log('-----------------------')
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
    let out_trade_no = data.xml.out_trade_no[0]
    let trade_status = data.xml.trade_status[0]
    if (trade_status == "TRADE_SUCCESS") {
        await OrderModel.findOneAndUpdate({_id: out_trade_no}, {
            status: 1,
            updateAt: Date.now()
        })
    }
}

module.exports = router