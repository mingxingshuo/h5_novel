const router = require('koa-router')()
const ChapterModel = require('../model/Chapter')

router.prefix('/chapter')

router.get('/all', async function (ctx, next) {
    let bid = ctx.request.query.bid;
    let chapter = await ChapterModel.find({bid: bid}).sort({sortid:1})
    ctx.body = chapter
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id;
    let chapter = await ChapterModel.find({id: id})
    ctx.body = chapter
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
