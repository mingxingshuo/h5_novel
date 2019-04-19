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
    let u_id = ctx.id, bid = ctx.request.query.bid, chapter;
    let first = await ChapterModel.findOne({bid: bid}).sort({id: 1})
    let last = await ChapterModel.findOne({bid: bid}).sort({id: -1})
    if(!id) {
        id = first.id;
    }
    if (first.id == id) {
        isfirst = true
    } else {
        isfirst = false
    }
    if (last.id == id) {
        islast = true
    } else {
        islast = false
    }
    if(!isfirst && !islast) {
        chapter = await ChapterModel.findOne({id: id})
    } else if(isfirst) {
        chapter = first;
    } else if (islast) {
        chapter = last;
    }
    // 待定收费逻辑
    if (!chapter.isvip) {
        return ctx.render('pages/content', {imgUrl: isfirst ? 'http://novel.jtjsmp.top/images/tuiguang/5e89f49e8ef136e4f7806adfa7a362f1.jpg' : '',  data: chapter, isfirst: isfirst, islast: islast, id: id, bid: ctx.request.query.bid})
    } else {
        let pay_book = await PayBookModel.findOne({u_id: u_id, bid: bid})
        if (pay_book) {
            return ctx.render('pages/content', {imgUrl: isfirst ? 'http://novel.jtjsmp.top/images/tuiguang/5e89f49e8ef136e4f7806adfa7a362f1.jpg' : '', data: chapter, isfirst: isfirst, islast: islast, id: id, bid: ctx.request.query.bid});
        } else {
            return ctx.redirect('/recharge?bid=' + bid + '&id=' + id)
        }
    }
});

module.exports = router;