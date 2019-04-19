const router = require('koa-router')()
const http = require('http')
const request = require('request')
const UserModel = require('../model/User')
const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')
const RecordModel = require('../model/Record')
const OrderModel = require('../model/Order')
const mem = require("../util/mem")
var BookPayRuleModel = require('../model/BookPayRule');

router.prefix('/')

router.get('/', async(ctx, next) => {
    let books = await BookModel.find({}, {id: 1})
    let book = books[parseInt(Math.random() * books.length)]

    ctx.redirect('/content?bid=' + book.id)
})

router.get('/content', async(ctx, next) => {
    //获取阅读章节

    let id = ctx.request.query.id, isfirst, islast
    let u_id = ctx.id, bid = ctx.request.query.bid, chapter;
    let first = await mem.get("h5_novel_content_first_" + bid);
    if (first) {
        first = JSON.parse(first)
    } else {
        first = await ChapterModel.findOne({bid: bid}).sort({id: 1})
        await mem.set("h5_novel_content_first_" + bid, JSON.stringify(first), 90)
    }
    let last = await mem.get("h5_novel_content_last_" + bid);
    if (last) {
        last = JSON.parse(last)
    } else {
        last = await ChapterModel.findOne({bid: bid}).sort({id: -1})
        await mem.set("h5_novel_content_last_" + bid, JSON.stringify(last), 80)
    }

    if (!id) {
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
    if (!isfirst && !islast) {
        chapter = await mem.get("h5_novel_content_chapter_" + bid + "_" + id);
        if (chapter) {
            chapter = JSON.parse(chapter)
        } else {
            chapter = await ChapterModel.findOne({id: id})
            await mem.set("h5_novel_content_chapter_" + bid + "_" + id, JSON.stringify(chapter), 80)
        }
    } else if (isfirst) {
        chapter = first;
    } else if (islast) {
        chapter = last;
    }


    //阅读章节写入cookie
    set_cookie(ctx, 'h5_novels_bid', bid)
    set_cookie(ctx, 'h5_novels_cid', chapter.id)

    let needpay = false;

    if (chapter.isvip) {
        let rule = await BookPayRuleModel.findOne({
            start: {$lte: chapter.id},
            end: {$gte: chapter.id},
            bid: bid
        })
        console.log(rule,'-------------rule')
        let order = await OrderModel.findOne({rid: rule._id})
        if (!order.status) {
            needpay = true
        }
    }

    if (!needpay) {
        let imgUrl = 'http://novel.jtjsmp.top/images/tuiguang/5e89f49e8ef136e4f7806adfa7a362f1.jpg',
          title = '全国名医都束手无策的病人，实习生的他妙手回春!';
        return ctx.render('pages/content', {
            imgUrl: isfirst ? imgUrl : '',
            title: isfirst ? title : '',
            data: chapter,
            isfirst: isfirst,
            islast: islast,
            id: id,
            bid: bid
        })
    } else {
        return ctx.redirect('/recharge?bid=' + bid + '&id=' + id)
    }
});

function set_cookie(ctx, key, value) {
    ctx.cookies.set(
        key, value, {
            path: '/',       // 写cookie所在的路径
            maxAge: 100 * 12 * 30 * 24 * 60 * 60 * 1000,   // cookie有效时长
            expires: new Date(Date.now() + 100 * 12 * 30 * 24 * 60 * 60 * 1000), // cookie失效时间
            httpOnly: false,  // 是否只用于http请求中获取
            overwrite: false  // 是否允许重写
        }
    );
}

module.exports = router;