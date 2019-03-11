const router = require('koa-router')()
const QudaoModel = require('../model/qudao')

router.prefix('/qudao')

router.get('/all', async function (ctx, next) {
    let qudao = await QudaoModel.find()
    if (qudao) {
        ctx.body = {success: '成功', data: qudao}
    } else {
        ctx.body = {err: "查找失败"}
    }
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id;
    let qudao = await QudaoModel.find({id: id})
    if (qudao) {
        ctx.body = {success: '成功', data: qudao}
    } else {
        ctx.body = {err: "查找失败"}
    }
})

router.post('/create', async(ctx, next) => {
    var data = {
        name: ctx.request.body.name,
        bookId: ctx.request.body.bookId,
        chapterId: ctx.request.body.chapterId,
        sex: ctx.request.body.sex,
        run: ctx.request.body.run
    }
    var docs = await QudaoModel.create(data);
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '创建失败，请检查输入是否有误'}
    }

})

router.post('/update', async(ctx, next) => {
    let id = ctx.request.query.id;
    var data = {
        name: ctx.request.body.name,
        bookId: ctx.request.body.bookId,
        chapterId: ctx.request.body.chapterId,
        sex: ctx.request.body.sex,
        run: ctx.request.body.run
    }
    var docs = await QudaoModel.findByIdAndUpdate(id, data, {new: true});
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '修改失败，请检查输入是否有误'}
    }
})

router.get('/delete', async(ctx, next) => {
    var id = ctx.request.query.id;
    var docs = await QudaoModel.findByIdAndRemove(id)
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '删除失败'}
    }
})

module.exports = router
