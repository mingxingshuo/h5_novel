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
    appId: '2019042264267313',
    privateKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv61yM5HfhCRhKtaBXcFYXG9kBq7AeiBWiTQi7r6GCeEJONj6E9e9n3Gke3olDYfahfJAPH99QYBZpkUDOayfZYKv8h9WaDJPffi3GXdvmc5GOD0SCasxfp1Ry8lSZd+3WHN6McHR6oaI2G+3yP5imULxCrFzR49Jz/d/IcP5w1ze1AwKyGncm1B19ozEwGoDLv649ExELdglgQ6gyr4Ja/vegbN1Ko6jSI4pSHDu+GYKvEqL1cxcRY3Z8Cr/RFRsSg18sBDgW4v8oIBJV3fPES2Ss+xb0QHpBCi8/qguzNQLsbFc3OtwqM2NnLNUp8JNqkvpXYlWOOexaEb0KTX2gQIDAQAB",
    alipayPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgkp9tIWG6mj5cG1LYhTW9dtElpoagnizP2iOCipk6/TL1Tde2JC+6Ux7zYjwsPrYwuM8kNBN9nBpFn3nbhSGRPHFCZj0g+9ZlZ94ZndJ87P5w8DKBXiPIz/KlbGcci/EUMkuTIy/mF7L3l+orssga7KzmY4xOM8Sk5hlQiJdVwfH3oJrGuiWwX31nIvK2vJ9/LNdhl4UDH5bLTBHdOiQwoLn/epM6719Y4lHjQE0AWYdx+94j1hsAzXb2jHFSu3quJrESDecJTsSULnraQ0u8e013rGgEze7ZS/7PHXJnfwj21YIWWP23iVLJaAXagZnWGEDfub41btxZN/vdcczswIDAQAB',
})

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

    let result = await alipaySdk.exec("http://n.tyuss.com", {
        notifyUrl: 'http://n.tyuss.com/alipay/back',
        appAuthToken: '',
        // sdk 会自动把 bizContent 参数转换为字符串，不需要自己调用 JSON.stringify
        bizContent: {
            subject: '黑牛全本小说',
            outTradeNo: doc._id.toString(),
            totalAmount: total_fee,
            product_code: 'QUICK_WAP_WAY'
        },
    }, {
        // 验签
        validateSign: true,
        // 打印执行日志
        log: this.logger,
    })
    console.log(result);
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