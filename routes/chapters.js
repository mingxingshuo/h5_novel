const router = require('koa-router')()
const ChapterModel = require('../model/Chapter')
const UserModel = require('../model/User')

router.prefix('/chapter')
var price = -30

router.get('/all', async function (ctx, next) {
    let bid = ctx.request.query.bid;
    let chapter = await ChapterModel.find({bid: bid})
    ctx.body = chapter
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id
    let unionid = ctx.request.query.unionid
    let chapter = await ChapterModel.findOne({id: id})
    let user = await UserModel.findOne({unionid: unionid})
    console.log(id,unionid,chapter,user,'---------------------chapter')
    if (!user.login) {
        ctx.body = "请先登录"
        return
    }
    if (chapter.isvip) {
        if (user.current > price) {
            await UserModel.update({$inc: {current: price}})
            ctx.body = chapter
        } else {
            ctx.body = "您的余额已不足，请及时充值"
        }
    } else {
        ctx.body = chapter
    }
})

router.get('/reset', async(ctx, next) => {
    var chapter = new ChapterModel()
    chapter.nextCount(function (err, count) {
        chapter.resetCount(function (err, nextCount) {
        });
    });
    ctx.body = {success: '重置成功'}
})


module.exports = router
