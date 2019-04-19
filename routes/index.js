const router = require('koa-router')()
const http = require('http')
const request = require('request')
const UserModel = require('../model/User')
const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')
const RecordModel = require('../model/Record')
const PayBookModel = require("../model/PayBook")

router.prefix('/')
var price = 30

router.get('/content', async(ctx, next) => {
    let id = ctx.request.query.id, isfirst, islast
    let u_id = ctx.id
    let chapter = await ChapterModel.findOne({id: id})
    let book = await BookModel.findOne({id: chapter.bid})
    let chapters = await ChapterModel.find({bid: id}).sort({id: 1})
    let first = chapters[0].id
    let last = chapters[chapters.length - 1].id
    if(!id) {
        let content = await ChapterModel.findOne({id: result.first});
        return ctx.render('pages/content', {data: content, isfirst: true, islast: false, id: result.first, bid: ctx.request.query.bid});
    }
    if (first == id) {
        isfirst = true
    } else {
        isfirst = false
    }
    if (last == id) {
        islast = true
    } else {
        islast = false
    }
    await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
        u_id: u_id,
        bid: chapter.bid,
        cid: id,
        updateAt: Date.now()
    }, {upsert: true});
    if (!chapter.isvip) {
        return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast, id: id, bid: ctx.request.query.bid})
    } else {
        let pay_book = await PayBookModel.findOne({u_id: u_id, bid: book.id})
        if (pay_book) {
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast, id: id, bid: ctx.request.query.bid})
        } else {
            return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id)
        }
    }
});

module.exports = router;