const router = require('koa-router')()
const ChapterModel = require('../model/Chapter')
const RuleModel = require('../model/BookPayRule')

router.prefix('/rule')

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id;
    let rule = await RuleModel.find({bid: id})
    if (rule) {
        ctx.body = {success: '成功', data: rule}
    } else {
        ctx.body = {err: "查找失败"}
    }
})

router.post('/create', async(ctx, next) => {
    console.log('11111111111111111111111111111111')
    console.log(ctx.request.body)
    console.log('11111111111111111111111111111111')
    let bid = ctx.request.body.bid
    let start = ctx.request.body.start
    let end = ctx.request.body.end
    let starts = await ChapterModel.findOne({bid: bid}, {id: 1}).sort({id: 1}).skip(start - 1)
    starts = starts.id
    let ends = await ChapterModel.findOne({bid: bid}, {id: 1}).sort({id: 1}).skip(end - 1)
    ends = ends.id
    let data = {
        bid: ctx.request.body.bid,
        price: ctx.request.body.price,
        start: starts,
        end: ends
    }
    console.log(data, '11111111111111111111111111111111111111111------------')
    let docs = await RuleModel.create(data);
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '创建失败，请检查输入是否有误'}
    }
})

// router.post('/update', async(ctx, next) => {
//     let id = ctx.request.body.id;
//     let bid = ctx.request.body.bid
//     let start = ctx.request.body.start
//     let end = ctx.request.body.end
//     let starts = await ChapterModel.findOne({bid: bid}, {id: 1}).sort({id: 1}).skip(start - 1)
//     let ends = await ChapterModel.findOne({bid: bid}, {id: 1}).sort({id: 1}).skip(end - 1)
//     let data = {
//         bid: ctx.request.body.bid,
//         price: ctx.request.body.price,
//         start: starts,
//         end: ends
//     }
//     var docs = await RuleModel.findByIdAndUpdate(id, data, {new: true});
//     if (docs) {
//         ctx.body = {success: '成功', data: docs}
//     } else {
//         ctx.body = {err: '修改失败，请检查输入是否有误'}
//     }
// })

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
