const router = require('koa-router')()
const ChapterModel = require('../model/Chapter')
const UserModel = require('../model/User')
const RecordModel = require('../model/Record')
const BookModel = require("../model/Book")
const mem = require('../util/mem')

router.prefix('/chapter')
var price = 30

router.get('/all', async function (ctx, next) {
    let bid = ctx.request.query.bid;
    let page = ctx.request.query.page;
    let chapter = await ChapterModel.find({bid: bid}).skip((page - 1) * 20).limit(20)
    ctx.body = {success: '成功', data: chapter}
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id
    let u_id = ctx.id
    let chapter = await ChapterModel.findOne({id: id})
    let book = await BookModel.findOne({id: chapter.bid})
    let user = ctx.user
    await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
        u_id: u_id,
        bid: chapter.bid,
        cid: id,
        updateAt: Date.now()
    }, {upsert: true})
    if (!chapter.isvip) {
        return ctx.body = {success: '成功', data: chapter}
    }
    let pay_book = await PayBookModel.findOne({u_id: u_id, bid: book.id})
    if (pay_book) {
        return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
    }else{
        return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id + '&title=' + encodeURIComponent(book.title))
    }
})

router.get('/userchapter', async function (ctx, next) {
    let user = await UserModel.findOne({_id: ctx.id})
    let book = await BookModel.find({id: {$in: user.shelf}})
    ctx.body = {success: '成功', data: book}
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
