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
    let chapter = await ChapterModel.find({bid: bid})
    ctx.body = {success: '成功', data: chapter}
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id
    let u_id = ctx.id
    let chapter = await ChapterModel.findOne({id: id})
    let user = ctx.user
    console.log('u_id:' + u_id);
    console.log(user);

    if (!chapter.isvip) {
        await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
            u_id: u_id,
            bid: chapter.bid,
            cid: id,
            updateAt: Date.now()
        }, {upsert: true})
        return ctx.body = {success: '成功', data: chapter}
    }
    if (user && user.isvip) {
        await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
            u_id: u_id,
            bid: chapter.bid,
            cid: id,
            updateAt: Date.now()
        }, {upsert: true})
        return ctx.body = {success: '成功', data: chapter}
    }
    let pay_chapter = user.pay_chapter.indexOf(id)
    if (pay_chapter != -1) {
        await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
            u_id: u_id,
            bid: chapter.bid,
            cid: id,
            updateAt: Date.now()
        }, {upsert: true})
        return ctx.body = {success: '成功', data: chapter}
    }
    if (user && user.balance > price) {
        await UserModel.findOneAndUpdate({_id: ctx.id}, {
            $addToSet: {pay_chapter: id},
            $inc: {balance: -price}
        })
        await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
            u_id: u_id,
            bid: chapter.bid,
            cid: id,
            updateAt: Date.now()
        }, {upsert: true})
        await mem.set("uid_" + user._id, 1);
        return ctx.body = {success: '成功', data: chapter}
    } else {
        let book = await BookModel.find({id: chapter.bid})
        if (!user) {
            return ctx.redirect('/needLogin')
        } else {
            return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id + '&title=' + book.title)
        }
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
