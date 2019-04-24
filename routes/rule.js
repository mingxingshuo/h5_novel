const router = require('koa-router')()
const ChapterModel = require('../model/Chapter')
const RuleModel = require('../model/BookPayRule')

router.prefix('/rule')

router.get('/all', async function (ctx, next) {
    let page = ctx.request.query.page || 1
    let book = await RuleModel.find(param).skip((page - 1) * 10).limit(10)
    ctx.body = {success: '成功', data: book}
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id;
    let rule = await RuleModel.find({_id: id})
    if (rule) {
        ctx.body = {success: '成功', data: rule}
    } else {
        ctx.body = {err: "查找失败"}
    }
})

router.post('/create', async(ctx, next) => {
    let bid = ctx.request.body.bid
    let start = ctx.request.body.start
    let end = ctx.request.body.end
    let starts = await ChapterModel.find({bid:bid},{id:1}).sort({id: 1}).skip(start-1).limit(1)
    let ends = await ChapterModel.find({bid:bid},{id:1}).sort({id: 1}).skip(end-1).limit(1)
    let data = {
        bid: ctx.request.body.bid,
        price: ctx.request.body.price,
        start: starts,
        end: ends
    }
    let docs = await RuleModel.create(data);
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '创建失败，请检查输入是否有误'}
    }
})

router.post('/update', async(ctx, next) => {
    let id = ctx.request.body.id;
    let bid = ctx.request.body.bid
    let start = ctx.request.body.start
    let end = ctx.request.body.end
    let starts = await ChapterModel.find({bid:bid},{id:1}).sort({id: 1}).skip(start-1).limit(1)
    let ends = await ChapterModel.find({bid:bid},{id:1}).sort({id: 1}).skip(end-1).limit(1)
    let data = {
        bid: ctx.request.body.bid,
        price: ctx.request.body.price,
        start: starts,
        end: ends
    }
    var docs = await RuleModel.findByIdAndUpdate(id, data, {new: true});
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '修改失败，请检查输入是否有误'}
    }
})

router.get('/delete', async(ctx, next) => {
    var id = ctx.request.query.id;
    var docs = await RuleModel.findByIdAndRemove(id)
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '删除失败'}
    }
})

module.exports = router
