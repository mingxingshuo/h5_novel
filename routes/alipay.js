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
    appId: '2016123456789012',
    privateKey: fs.readFileSync('./conf/private-key.pem', 'ascii'),
    alipayPublicKey: fs.readFileSync('./conf/public-key.pem', 'ascii'),
});
// const alipaySdk = new AlipaySdk({
//     appId: '2019042264267313',
//     alipayPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuqP0/bBb8ca8RUaDVSmtd5wfwM0zw2+UOMJ+FyCkttekb8sXXzhieFk8mHK+zaAIPWH2x6U3R6+R1dDqap01Y+M0aJxw+zOxCQLzOr2SVLKrniiPn2YlUsXD0S0yCtLRBKRM7CjLGwCatG2kKFFYC7QbkJaABDT/vKvHZqdv+e2lWWtu7340UPXqJW6yf8F5dxEMQbm40a4iEf0dthJ0cUWmOY8eAwM6vPVnffDkTRhcjLbtu48eqgvl4v8804DM5ecR/ckXhzEP+Yj0a2EHokQiPNtiegGrHS66LoLPUWLvk3pXew+33KG5gtVBtgVbzLve0KvN+dTsy7VJ9HmrwQIDAQAB",
//     privateKey: 'MIIEogIBAAKCAQEAuqP0/bBb8ca8RUaDVSmtd5wfwM0zw2+UOMJ+FyCkttekb8sXXzhieFk8mHK+zaAIPWH2x6U3R6+R1dDqap01Y+M0aJxw+zOxCQLzOr2SVLKrniiPn2YlUsXD0S0yCtLRBKRM7CjLGwCatG2kKFFYC7QbkJaABDT/vKvHZqdv+e2lWWtu7340UPXqJW6yf8F5dxEMQbm40a4iEf0dthJ0cUWmOY8eAwM6vPVnffDkTRhcjLbtu48eqgvl4v8804DM5ecR/ckXhzEP+Yj0a2EHokQiPNtiegGrHS66LoLPUWLvk3pXew+33KG5gtVBtgVbzLve0KvN+dTsy7VJ9HmrwQIDAQABAoIBAH6iE+20pQ2sW71dFGrJ9mp7QYgdMovdvuGsBMVIXrm4Ile/okH3Dci+M0D0ScVWWYDcYQYgcRtwYjCCqSphNAJr+/kme/nUnr+QgttOGGTjPVH4D0qFkblReYUJdzSkyTCvEYoCO5w8krrs0T6Rwn1eXH2Dv6QbGZE3s/lQjccybrr/0Gk/NNmOXduxpMO0cGQWhowbP4L7kGWi1L9bEed9HYuqzchGvAS3Fq55e0H24uDQz3ZkdkLmIkGwj0mWVI1fUEr3qJBAVJKVK4YKig/5hBFqhBxnuEj7+xRQowYSSsSegsxIBBv+1bmVcU75gZleMBhIzlhLZ9HAuXYAv2ECgYEA8SG7YSivpaaEy4kBtqoWtNVTjPhZAzLrQ6mj4hRMKvp9Vnl9J1nvP/myCbKW3EQATxNCIM30gDIXFOihdQZr0l+j51ldEKiYkAedN8jORLtg+r0DEgPeeQWBh55Ceq+VG9LMIUzFCYHRL63YI3PnFdNllqyZbkHDoyyimYdc3iUCgYEAxiYUO41CkIDyzFz78a7Dsj2AgG83HyAboxEhnbjfn3k0xXgaYjvB2HP0/cFPZ7ZFGouGL4fZ/ZfEs9MTDsxS/pRJpq954aHl6A2Xaoq0G0K0qKmpdwGlqVrQycfVQBYUnOpvmX/mte5gvx5IZPFf3h7URo+KybzHQsCK0tav3m0CgYAQv48MSI8qqk4+9N0xms7I8KhE+lr0Ze0BXh8L7Oz9bziVcQrIWO7NOsKq+cSQuAhtdaD6NlPtM4123lGYl0GV8x6nSwWzyoIOPvkkjsYE8B7kS4yTC8HAFinRCaUEcH2i2Rlklrh42JN3BFQm4j4CvhQoSwS9K8Qy6T7B+yzwIQKBgCjNOIdWvCkzVEu+reaDXSq7vVU1EX2oR+iZI3nt0qZs9+/dnlkyAuWGYyFJiAdMIgioSFZLPBkbAlchFKCMdF6VvGDFa2yJwOS6v74hl5qxbq/4V7v4q9smpy2Vp5TNtyrkn1xVWPWHg4Z3PuMCTQJZCM8KycJmzAUzzqJBsO81AoGAKzzto6DjDrPfKu2gAU5oTCq1cLJk4p1JclhmU/zaBk/us3ty63FDB0aP9sbFYkVyatoe22J9WS44eLjS9oaX4fGJZMuwp59QKJgsgkF+pxlciNUOfkdrmeIo/LOeKTH2rO6ICag5Ww8TILTonp3ZdLJCUaqXy4cPLxErujfJKI8=',
// })

router.prefix('/alipay')

router.get('/', async function (ctx, next) {
    let bid = ctx.request.query.bid
    let distribution = ctx.request.query.distribution
    let total_fee = ctx.request.query.price
    let u_id = ctx.id
    let rule = BookPayRuleModel.findOne({bid: bid, price: total_fee})
    let doc = await OrderModel.create({
        u_id: u_id,
        bid: bid,
        rid: rule._id,
        distribution: distribution,
        total_fee: total_fee,
        type: 2
    })

    let result = await alipaySdk.exec("http://p.tyuss.com", {
        notifyUrl: 'http://p.tyuss.com/alipay/back',
        appAuthToken: '',
        // sdk 会自动把 bizContent 参数转换为字符串，不需要自己调用 JSON.stringify
        bizContent: {
            subject: '黑牛全本小说',
            outTradeNo: doc._id.toString(),
            totalAmount: total_fee,
            productCode: 'QUICK_WAP_WAY'
        },
    }, {
        // 验签
        validateSign: true,
        // 打印执行日志
        log: this.logger,
    })
    console.log(result,'-------------------result');
    ctx.redirect("https://openapi.alipay.com/gateway.do")
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