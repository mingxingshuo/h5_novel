const router = require('koa-router')()
const http = require('http')
const request = require('request')
const UserModel = require('../model/User')
const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')
const RecordModel = require('../model/Record')
const PayBookModel = require("../model/PayBook")

router.prefix('/')

router.get('/', async(ctx,next)=>{
    let books = await BookModel.find({},{id:1})
    let book = books[parseInt(Math.random()*books.length)]

    ctx.redirect('/content?bid='+book.id)
})

var price = 30

router.get('/content', async(ctx, next) => {
    let id = ctx.request.query.id, isfirst, islast
    let u_id = ctx.id
    let first = await ChapterModel.findOne({bid: ctx.request.query.bid}).sort({id: 1})
    let last = await ChapterModel.findOne({bid: ctx.request.query.bid}).sort({id: -1})
    if(!id) {
        let content = await ChapterModel.findOne({id: first});
        return ctx.render('pages/content', {imgUrl: "http://novel.jtjsmp.top/images/tuiguang/5e89f49e8ef136e4f7806adfa7a362f1.jpg", data: content, isfirst: true, islast: false, id: first, bid: ctx.request.query.bid});
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
    let chapter = await ChapterModel.findOne({id: id})
    let book = await BookModel.findOne({id: chapter.bid})
    await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
        u_id: u_id,
        bid: chapter.bid,
        cid: id,
        updateAt: Date.now()
    }, {upsert: true});
    if (!chapter.isvip) {
        return ctx.render('pages/content', {imgUrl: isfirst ? 'http://novel.jtjsmp.top/images/tuiguang/5e89f49e8ef136e4f7806adfa7a362f1.jpg' : '',  data: chapter, isfirst: isfirst, islast: islast, id: id, bid: ctx.request.query.bid})
    } else {
        let pay_book = await PayBookModel.findOne({u_id: u_id, bid: book.id})
        if (pay_book) {
            return ctx.render('pages/content', {imgUrl: isfirst ? 'http://novel.jtjsmp.top/images/tuiguang/5e89f49e8ef136e4f7806adfa7a362f1.jpg' : '', data: chapter, isfirst: isfirst, islast: islast, id: id, bid: ctx.request.query.bid});
        } else {
            return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id)
        }
    }
});

module.exports = router;