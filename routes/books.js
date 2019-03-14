const router = require('koa-router')()
const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')
const RecordModel = require('../model/Record')

router.prefix('/book')

router.get('/all', async function (ctx, next) {
    let page = ctx.request.query.page || 1
    let tag_sex = ctx.request.query.tag_sex || 2;
    let title = new RegExp(ctx.request.query.title);
    let param = {tag_sex: tag_sex}
    if (title) {
        param.title = {$regex: title}
    }
    let book = await BookModel.find(param).skip((page - 1) * 10).limit(10)
    console.log(book, '------------book')
    ctx.body = {success: '成功', data: book}
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id;
    let book = await BookModel.findOne({id: id})
    let chapters = await ChapterModel.find({bid: id}).sort({id: 1})
    let first = chapters[0].id
    let last = chapters[chapters.length - 1].id
    ctx.body = {success: '成功', data: {book: book, first: first, last: last}}
})

router.get('/userbooks', async function (ctx, next) {
    let user = ctx.user
    let book = await BookModel.find({id: {$in: user.shelf}})
    ctx.body = {success: '成功', data: book}
})

router.get('/recordbook', async function (ctx, next) {
    let u_id = ctx.request.query.u_id
    let record = await RecordModel.findOne({u_id: u_id}).sort({updateAt: -1})
    ctx.body = {success: '成功', data: record}
})

router.get('/record', async function (ctx, next) {
    let u_id = ctx.request.query.u_id
    let bid = ctx.request.query.bid
    let record = await RecordModel.findOne({u_id: u_id, bid: bid})
    ctx.body = {success: '成功', data: record}
})

// router.post('/update', async(ctx, next) => {
//     let id = ctx.request.body.id
//     let pay_num = ctx.request.body.pay_num
//     let data = {
//         title: ctx.request.body.title,
//         zuozhe: ctx.request.body.zuozhe,
//         desc: ctx.request.body.desc,
//         zishu: ctx.request.body.zishu,
//         zhishu: ctx.request.body.zhishu,
//         xstype: ctx.request.body.xstype,
//         status: ctx.request.body.status,
//         qiyong: ctx.request.body.qiyong,
//         sex: ctx.request.body.sex,
//         type: ctx.request.body.type,
//         pay_num: pay_num,
//         xianmian_start: ctx.request.body.xianmian_start,
//         xianmian_end: ctx.request.body.xianmian_end
//     }
//     let book = await BookModel.findOneAndUpdate({id: id}, data, {new: true})
//     let chapter = await ChapterModel.findOne({bid: id})
//     let chapter_id = chapter.id
//     await ChapterModel.updateMany({bid: id, id: {$lt: (pay_num + chapter_id - 1)}}, {isvip: 0})
//     await ChapterModel.updateMany({bid: id, id: {$gte: (pay_num + chapter_id - 1)}}, {isvip: 1})
//     if (book) {
//         ctx.body = {success: '修改成功', data: book}
//     } else {
//         ctx.body = {err: '修改失败'}
//     }
// })

router.get('/reset', async(ctx, next) => {
    var book = new BookModel()
    book.nextCount(function (err, count) {
        book.resetCount(function (err, nextCount) {
        });
    });
    ctx.body = {success: '重置成功'}
})

module.exports = router
