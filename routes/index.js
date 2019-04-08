const router = require('koa-router')()
const http = require('http')
const request = require('request')
const UserModel = require('../model/User')
const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')
const RecordModel = require('../model/Record')
const OrderModel = require('../model/Order')
router.prefix('/')
var price = 30

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
    let isLogin;
    if (ctx.user) {
        isLogin = true
    } else {
        isLogin = false
    }
    let user = await UserModel.findOne({_id: ctx.id})
    await ctx.render('pages/account', {user: user, isLogin: isLogin});
})

router.get('/bookDetail', async(ctx, next) => {
    // 是否添加到书架
    let user = await UserModel.findOne({_id: ctx.id})
    let id = ctx.request.query.id, read = {}
    let inShelf = user.shelf.indexOf(id) === -1 ? false : true;
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
    let user = await UserModel.findOne({_id: ctx.id})
    let shelf = await BookModel.find({id: {$in: user.shelf}})
    // 查询所有书籍
    let param = {tag_sex: 2}
    let book = await BookModel.findOne(param).limit(1)
    await ctx.render('pages/bookShelf', {result: result, data: data, shelf: shelf, book: book})
});

router.get('/bookStore', async(ctx, next) => {
    await ctx.render('pages/bookStore')
});

router.get('/content', async(ctx, next) => {
    let id = ctx.request.query.id, isfirst, islast
    let u_id = ctx.id
    let chapter = await ChapterModel.findOne({id: id})
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
    if (user) {
        if (user.isvip) {
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        }
        let pay_chapter = user.pay_chapter.indexOf(id)
        if (pay_chapter != -1) {
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        }
        if (user.balance > price) {
            await UserModel.findOneAndUpdate({_id: ctx.id}, {
                $addToSet: {pay_chapter: id},
                $inc: {balance: -price}
            })
            await mem.set("uid_" + user._id, '', 1);
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        } else {
            let book = await BookModel.findOne({id: chapter.bid})
            console.log(encodeURIComponent('/recharge?bid=' + book.id + '&id=' + id + '&title=' + book.title), '----------------------------book')
            return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id + '&title=' + encodeURIComponent(book.title))
        }
    } else {
        return ctx.redirect('/needLogin')
    }
})

router.get('/chapters', async(ctx, next) => {
    let result = await ChapterModel.find({bid: ctx.request.query.bid});
    let title = decodeURI(ctx.request.query.title)
    let data = {result: result}
    data = JSON.stringify(data);
    console.log("data", data)
    await ctx.render('pages/chapters', {data: data, title: title})
})

router.get('/record', async(ctx, next) => {
    await ctx.render('pages/record')
})

router.get('/recharge', async(ctx, next) => {
    await ctx.render('pages/recharge')
})


module.exports = router;