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
    console.log(id, unionid, chapter, user, '---------------------chapter')
    if (!user.login) {
        return ctx.body = "请先登录"
    }
    if (chapter.isvip) {
        if(user.isvip) {
            return ctx.body = chapter
        }else{
            let pay_chapter = user.pay_chapter.indexOf(id)
            if (pay_chapter != -1) {
                return ctx.body = chapter
            } else {
                if (user.current > price) {
                    user.update({
                        $addToSet: {pay_chapter: id},
                        $inc: {current: price}
                    })
                    return ctx.body = chapter
                } else {
                    return ctx.body = "您的余额已不足，请及时充值"
                }
            }
        }
    } else {
        return ctx.body = chapter
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
