const router = require('koa-router')()
const ChapterModel = require('../model/Chapter')
const UserModel = require('../model/User')
const RecordModel = require('../model/Record')
const BookModel = require("../model/Book")
const PayChapterModel = require("../model/PayChapter")
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
    if (user) {
        if (user.isvip) {
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        }
        let pay_chapter = await PayChapterModel.findOne({u_id: u_id, chapter: id})
        if (pay_chapter) {
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        }
        if (user.balance > price) {
            await UserModel.findOneAndUpdate({_id: u_id}, {
                $inc: {balance: -price}
            })
            await PayChapterModel.create({u_id: u_id, cid: id})
            await mem.set("uid_" + user._id, '', 1);
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        } else {
            let book = await BookModel.findOne({id: chapter.bid})
            return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id + '&title=' + encodeURIComponent(book.title))
        }
    } else {
        return ctx.redirect('/needLogin')
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
