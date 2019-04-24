const router = require('koa-router')()
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
    let data = {
        bid: ctx.request.body.bid,
        price: ctx.request.body.price,
        start: ctx.request.body.start,
        end: ctx.request.body.end
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
    var data = {
        bid: ctx.request.body.bid,
        price: ctx.request.body.price,
        start: ctx.request.body.start,
        end: ctx.request.body.end
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
