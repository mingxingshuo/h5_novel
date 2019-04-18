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
//
// async function httpRequest(url, id) {
//     return new Promise((resolve, reject) => {
//         request.get({
//             url: url,
//             headers: {
//                 uid: id
//             }
//         }, (err, res, body) => {
//             let data = JSON.parse(body)
//             resolve(data)
//         })
//     })
// }

async function book(id) {
    let book = await BookModel.findOne({id: id})
    let chapters = await ChapterModel.find({bid: id}).sort({id: 1})
    return new Promise((resolve, reject) => {
        let first = chapters[0].id
        let last = chapters[chapters.length - 1].id
        resolve({book: book, first: first, last: last})
    })
}

router.get('/content', async(ctx, next) => {
    let id = ctx.request.query.id, isfirst, islast
    let u_id = ctx.id
    let chapter = await ChapterModel.findOne({id: id})
    let book = await BookModel.findOne({id: chapter.bid})
    let user = ctx.user
    let result = await book(ctx.request.query.bid)
    if (result.first == id) {
        isfirst = true
    } else {
        isfirst = false
    }
    if (result.last == id) {
        islast = true
    } else {
        islast = false
    }
    await RecordModel.findOneAndUpdate({u_id: u_id, bid: chapter.bid}, {
        u_id: u_id,
        bid: chapter.bid,
        cid: id,
        updateAt: Date.now()
    }, {upsert: true})
    if (!chapter.isvip) {
        return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
    }
    let pay_book = await PayBookModel.findOne({u_id: u_id, bid: book.id})
    if (pay_book) {
        return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
    }else{
        return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id + '&title=' + encodeURIComponent(book.title))
    }
})

module.exports = router;