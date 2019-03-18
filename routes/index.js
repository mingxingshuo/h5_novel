const router = require('koa-router')()
const http = require('http')
const request = require('request')
const UserModel = require('../model/User')
const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')
const RecordModel = require('../model/Record')
router.prefix('/')

async function httpRequest(url, id) {
    return new Promise((resolve, reject) => {
        request.get({
            url: url,
            headers: {
                uid: id
            }
        }, (err, res, body) => {
            let data = JSON.parse(body)
            resolve(data)
        })
    })
}

async function book(id) {
    let book = await BookModel.findOne({id: id})
    let chapters = await ChapterModel.find({bid: id}).sort({id: 1})
    return new Promise((resolve, reject) => {
        let first = chapters[0].id
        let last = chapters[chapters.length - 1].id
        resolve({book: book, first: first, last: last})
    })
}

router.get('/account', async(ctx, next) => {
    let user = await UserModel.findOne({_id: ctx.id})
    await ctx.render('pages/account', user);
})

router.get('/bookDetail', async(ctx, next) => {
    // 是否添加到书架
    let user = await UserModel.findOne({_id: ctx.id})
    let id = ctx.request.query.id, read = {}
    let inShelf = user.shelf.indexOf(id) == -1 ? false : true
    // 获取书信息
    let info = await book(id)
    // 是否有阅读记录
    let result = await RecordModel.findOne({u_id: ctx.id, bid: id})
    if (info && result) {
        read = {
            id: result.cid,
            hasrecord: true
        }
    } else if (info) {
        read = {
            id: info.first,
            hasrecord: false
        }
    }
    let chapters = await ChapterModel.find({bid: id})
    await ctx.render('pages/bookDetail', {
        inShelf: inShelf,
        info: info.book,
        read: read,
        chapters: chapters.slice(0, 10)
    })
})

router.get('/bookShelf', async(ctx, next) => {
    let result = await RecordModel.findOne({u_id: ctx.id}).sort({updateAt: -1})
    let data;
    if (result) {
        data = await BookModel.findOne({id: result.bid})
    }
    let shelf = await BookModel.find({id: {$in: ctx.user.shelf}})
    await ctx.render('pages/bookShelf', {result: result, data: data, shelf: shelf})
})

router.get('/bookStore', async(ctx, next) => {
    await ctx.render('pages/bookStore')
})

router.get('/content', async(ctx, next) => {
    let id = ctx.request.query.id, isfirst, islast
    let data = await httpRequest("http://localhost:3001/chapter?id=" + id, ctx.id)
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
    await ctx.render('pages/content', {data: data.data, isfirst: isfirst, islast: islast})
})

router.get('/chapters', async(ctx, next) => {
    let result = await ChapterModel.find({bid: ctx.request.query.bid})
    let title = decodeURI(ctx.request.query.title)
    await ctx.render('pages/chapters', {data: result, title: title})
})

router.get('/record', async(ctx, next) => {
    await ctx.render('pages/record')
})

router.get('/recharge', async(ctx, next) => {
    await ctx.render('pages/recharge')
})


module.exports = router