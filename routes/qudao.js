const router = require('koa-router')()
const QudaoModel = require('../model/QudaoModel')

router.prefix('/qudao')

router.get('/all', async function (ctx, next) {
    let qudao = await QudaoModel.find()
    ctx.body = qudao
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id;
    let qudao = await QudaoModel.find({id: id})
    ctx.body = qudao
})

router.post('/create', async (ctx,next)=>{
    var message = {
        codes:ctx.request.body.codes,
        task: ctx.request.body.task,
        is_timing: ctx.request.body.is_timing,
        delay: ctx.request.body.delay,
        timing_time: ctx.request.body.timing_time,
        type:parseInt(ctx.request.body.type),
        contents: ctx.request.body.contents,
        img: ctx.request.body.img,
        take_over: ctx.request.body.take_over,
        tagId: ctx.request.body.tagId
    }
    var docs = await QudaoModel.create(message);
    if (docs) {
        ctx.body= {success: '成功', data: docs}
    } else {
        ctx.body= {err: '创建失败，请检查输入是否有误'}
    }

})

router.post('/update', async (ctx,next)=>{
    let id = ctx.request.query.id;
    var message = {
        codes:ctx.request.body.codes,
        task: ctx.request.body.task,
        is_timing: ctx.request.body.is_timing,
        delay: ctx.request.body.delay,
        timing_time: ctx.request.body.timing_time,
        type:parseInt(ctx.request.body.type),
        contents: ctx.request.body.contents,
        img: ctx.request.body.img,
        take_over: ctx.request.body.take_over,
        tagId: ctx.request.body.tagId
    }
    var docs = await QudaoModel.findByIdAndUpdate(message);
    if (docs) {
        ctx.body= {success: '成功', data: docs}
    } else {
        ctx.body= {err: '创建失败，请检查输入是否有误'}
    }

})

router.get('/delete',async (ctx,next)=>{
    var id = ctx.request.query.id;
    var docs = await QudaoModel.findByIdAndDelete(id)
    var docs1 = await QudaoModel.find()
    ctx.body = {success: '删除成功', data: docs1}
})

module.exports = router
