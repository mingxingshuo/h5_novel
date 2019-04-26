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
    privateKey: 'MIIEpAIBAAKCAQEA57BLTttxETFe4HqHxENUCZXLoGYsJB47Ms1YaQV9Y2kVgEdAz0a6Ig8b887POTDPQSCz8CtqWZD6mmYjb4hTn8aG4Ru8mNSwwbdkkG8W43MSSyJerIYtGCTY33krq4OZFxnPBh79VF+xnk7qUXgzqBZVJ45aws4mmexSV5Y6R2lvlGf9mBus54y38GE8/2F3xop5H0joodw637/5LD2xcZ+/WUNdICNV7tNSQXFZISLiGUP9sSMVeGNhdCgS/bXMZAfTPR8bpBF5aitaRuA+ZjUakGkdNLYC8m9RjK7KTh5Ss4PEZO9bdDoXaw2mJaJvwvTXTtkSOWmLWeAZNWIJYQIDAQABAoIBAHcgdUhBmpxNd0wSlHY8bBxVkhKSFkYn6SZQ4RF2yibwJCcF+/PXmOLkQ+oTPwdX6mjBSOPHXvJYkhILTFMPlHfFmxppqYonag7gneuJwwoF47UQIf+xKcSNRZl58xNIIdH36jNqgbT9UxVj3CUxmdXmTbh+AHrDhqOEGD6Ctsp6GETz5zyULmQQXCQz9pO8baYVqyetUxKYjMCS+06YiXkcMIBSiJUok53NSm/ABgx9h+OgrdDDl5THWWuUKjHyUXzX8qs3pENRY1de1f9xy+erwj3F7jmAjcVsnO7bPyosO+U1Xm8DosEX1FMji4RZDbXNhgL3S3BT+ARq/n6+uUUCgYEA/dXzLVvqvHJTi4cok+PTKJQ1raiyWjz1NJ0/U5kfhn/9yQf4JJ1oxDR5FAxdVNjGjT4nihPAGo9c+yNb4fWe5JkCkuu/MlQdot2Ylv9C8NZ8SkGN4BsMad/NPsToh6Ysac0MHmIobyvR5PHA0D0mLc8+En+YbT7xGM2YUcvxzv8CgYEA6aoA6Q8PpiIqfJgj7BA0rPi0ZxR1yrFsZ4RhDxJJgj65IPTOaJCTvfpvVK3mMza3PFTKMbyhZyqUvsy9eFRmCpJILY0+wvJ68K9d4lO33hAGSi1KgYwGB6v4aW/lsnO2NgutEQdL+wnbBEx+S6BS2lf4pwKNsuwGeRA4KuP2h58CgYEAz7PTyhfeWdjK1+7+mxTe4eN0kObrGb+rfSP2f3daPnpYtbiZqYxL/9BYCrmbXSQMQ+LKA8fpd1I76RujwZ90JuW1H3db+diub2gXxeaVZfB7v18osmovnCqPDX+eLfEhgmlQM0RqhZ07oLTY6ww+Q1nDFuvlU+8e5QbGTpgtAw0CgYEAtka79xKcroiwhAla3Ge378cDU/YN/VRysD4ASPWHCmdLm33dFozR871M483UadchEZtDL5Fqh0QcTMsCcr/D6jM6wu4QK5tkdCUZI9kS8dOmVG8IVA6bFZj9a6KymIbTeU2acFI031xM0gmp6+zhNRqzCfVf/FdKpV4Vsr+qLRkCgYAkkI8FqqaZ5ET/OuKxKApRvtjWRMUDrSGapbgj9UEGUBi7+qbxUMCUmLLwhhGWU03GvwZUfIYeNm3QzTrjGrv/ZMXW6i9G6FOz/Nu7+FBNdOO1Nsamtny3fSJ7eoP4LFXHD8CSHiRnF78/xDQyp6IrJVKBqeJ5wOn6ydLTPntlrA==',
    alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA57BLTttxETFe4HqHxENUCZXLoGYsJB47Ms1YaQV9Y2kVgEdAz0a6Ig8b887POTDPQSCz8CtqWZD6mmYjb4hTn8aG4Ru8mNSwwbdkkG8W43MSSyJerIYtGCTY33krq4OZFxnPBh79VF+xnk7qUXgzqBZVJ45aws4mmexSV5Y6R2lvlGf9mBus54y38GE8/2F3xop5H0joodw637/5LD2xcZ+/WUNdICNV7tNSQXFZISLiGUP9sSMVeGNhdCgS/bXMZAfTPR8bpBF5aitaRuA+ZjUakGkdNLYC8m9RjK7KTh5Ss4PEZO9bdDoXaw2mJaJvwvTXTtkSOWmLWeAZNWIJYQIDAQAB',
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
            notifyUrl: encodeURIComponent('http://p.rrtvz.com/alipay/back'),
            returnUrl:encodeURIComponent('http://p.rrtvz.com/alipay/content'),
            appAuthToken: '',
            // sdk 会自动把 bizContent 参数转换为字符串，不需要自己调用 JSON.stringify
            bizContent: {
                subject: encodeURIComponent('黑牛全本小说'),
                outTradeNo: doc._id.toString(),
                totalAmount: total_fee,
                productCode: 'QUICK_WAP_WAY',
                quitUrl:encodeURIComponent('http://p.rrtvz.com/alipay/content')
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