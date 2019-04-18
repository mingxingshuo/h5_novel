const router = require('koa-router')();
const request = require('request');
const UserModel = require('../model/User');
const BookModel = require('../model/Book');
const ChapterModel = require('../model/Chapter');
const RecordModel = require('../model/Record');
const PayChapterModel = require("../model/PayChapter");
router.prefix('/');
var price = 30;
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
    let book = await BookModel.findOne({id: id});
    let chapters = await ChapterModel.find({bid: id}).sort({id: 1});
    return new Promise((resolve, reject) => {
        let first = chapters[0].id;
        let last = chapters[chapters.length - 1].id;
        resolve({book: book, first: first, last: last});
    })
}

router.get('/content', async(ctx, next) => {
    let id = ctx.request.query.id, isfirst, islast;
    let u_id = ctx.id;
    let chapter = await ChapterModel.findOne({id: id});
    let user = ctx.user;
    let result = await book(ctx.request.query.bid);
    if(!id) {
        console.log(result.first)
        let content = await ChapterModel.findOne({id: result.first});
        return ctx.render('pages/content', {data: content, isfirst: true, islast: false});
    }
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
    }, {upsert: true});
    if (!chapter.isvip) {
        return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast});
    }
    if (user) {
        if (user.isvip) {
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        }
        let pay_chapter = await PayChapterModel.findOne({u_id: u_id, chapter: id});
        if (pay_chapter) {
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        }
        if (user.balance > price) {
            await UserModel.findOneAndUpdate({_id: u_id}, {
                $inc: {balance: -price}
            });
            await PayChapterModel.create({u_id: u_id, cid: id});
            await mem.set("uid_" + user._id, '', 1);
            return ctx.render('pages/content', {data: chapter, isfirst: isfirst, islast: islast})
        } else {
            let book = await BookModel.findOne({id: chapter.bid});
            console.log(encodeURIComponent('/recharge?bid=' + book.id + '&id=' + id + '&title=' + book.title), '----------------------------book');
            return ctx.redirect('/recharge?bid=' + book.id + '&id=' + id + '&title=' + encodeURIComponent(book.title))
        }
    } else {
        return ctx.redirect('/needLogin')
    }
});

module.exports = router;