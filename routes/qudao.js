const router = require('koa-router')()
const QudaoModel = require('../model/Qudao')

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
    let qudao = await QudaoModel.find({run: 1})
    if (qudao) {
        ctx.body = {success: '成功', data: qudao}
    } else {
        ctx.body = {err: "查找失败"}
    }
})

router.post('/create', async(ctx, next) => {
    let id = ctx.request.body.id;
    if (id) {
        let docs = await QudaoModel.findByIdAndUpdate(id, {run: 0});
        if (docs) {
            ctx.body = {success: '成功', data: docs}
        } else {
            ctx.body = {err: '创建失败，请检查输入是否有误'}
        }
    } else {
        let data = {
            name: ctx.request.body.name,
            bookId: ctx.request.body.bookId,
            bookName: ctx.request.body.bookName,
            chapterId: ctx.request.body.chapterId,
            chapterName: ctx.request.body.chapterName,
            sex: ctx.request.body.sex,
            run: 1
        }
        await QudaoModel.update({}, {run: 0}, {new: true, multi: true});
        let docs = await QudaoModel.create(data);
        if (docs) {
            ctx.body = {success: '成功', data: docs}
        } else {
            ctx.body = {err: '创建失败，请检查输入是否有误'}
        }
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
