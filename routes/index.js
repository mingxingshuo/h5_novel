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
var DistributionModel = require('../model/Distribution');
var pro_conf = require('../conf/proj.json');

const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();
 
redis_client.on("error", function (err) {
    console.log("redis Error " + err);
});

router.prefix('/');

router.all('/build/*', async(ctx, next) => {
    return ctx.render('build/index');
});

router.get('/chapters', async(ctx, next) => {
    let bid = ctx.request.query.bid;
    let result = await ChapterModel.find({bid: bid});
    let book = await BookModel.findOne({id: bid});
    let data = {result: result};
    data = JSON.stringify(data);
    await ctx.render('pages/chapters', {data: data, title: book.title})
});

router.get('/', async(ctx, next) => {
    let books = await BookModel.find({}, {id: 1,weight:1})
    let book_list = []
    for (var i = 0; i < books.length; i++) {
        let item = books[i]
        for (var j = 0; j < item.weight; j++) {
            book_list.push(item.id)
        }
    }
    //console.log(book_list)
    let book_id = book_list[parseInt(Math.random() * book_list.length)]
    ctx.redirect('/content?bid=' + book_id)
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
    let vip_chapter = await mem.get("h5_novel_chapter_" + id)
    //console.log(vip_chapter, chapter.id, bid, '------------------vip_chapter1')
    if (!vip_chapter) {
        let rule = await BookPayRuleModel.findOne({
            start: {$lte: chapter.id},
            end: {$gte: chapter.id},
            bid: parseInt(bid)
        })
        if (rule && rule.price) {
            await mem.set("h5_novel_chapter_" + id, JSON.stringify(rule), 80)
            vip_chapter = JSON.stringify(rule)
        } else {
            await mem.set("h5_novel_chapter_" + id, -1, 80)
            vip_chapter = -1
        }
    }
    //console.log(vip_chapter, '------------------vip_chapter2')

    //缓存

    if (vip_chapter != -1) {
        let order = await OrderModel.findOne({u_id: u_id, rid: JSON.parse(vip_chapter)._id})
        if (!order || !order.status) {
            needpay = true
        }
    }

    let dis = await get_dis(ctx.channel)
    //console.log(ctx.channel)
    //console.log(dis)

    statics(ctx)

    //console.log(needpay, '---------------------needpay')

    // 第一章标题图片
    let firstChapter = await get_book(bid);
    return ctx.render('pages/content', {
        imgUrl: isfirst ? firstChapter.image_url : '',
        title: isfirst ? firstChapter.page_title : '',
        url_title : firstChapter.title,
        data: chapter,
        isfirst: isfirst,
        islast: islast,
        id: id,
        bid: bid,
        needpay: needpay,
        rule_data: JSON.parse(vip_chapter),
        pay_domain : pro_conf.pay_domain,
        wxpay_domain : pro_conf.wxpay_domain,
        isWXchat : ctx.userAgent.source.match(/MicroMessenger/i) == 'MicroMessenger',
        dis : dis
    })

});

async function statics(ctx){
   /*
    await redis_client.incr('h5novelsChannelsPv_'+ctx.channel)
    await redis_client.pfadd('h5novelsChannelsUv_'+ctx.channel,ctx.id)
    await redis_client.incr('h5novelsBooksPv_'+ctx.request.query.bid)
    await redis_client.pfadd('h5novelsBooksUv_'+ctx.request.query.bid,ctx.id)
    */
    
    await redis_client.incr('h5novelsCBPv_'+ctx.channel+'_'+ctx.request.query.bid)
    await redis_client.pfadd('h5novelsCBUv_'+ctx.channel+'_'+ctx.request.query.bid,ctx.id.toString())
}

async function get_dis(key) {
    if(!key || key=='undefined'){
        return null;
    }
    let dis = await mem.get("h5_novel_adzone_dis_" + key);
    if (dis) {
        dis = JSON.parse(dis)
    } else {
        dis = await DistributionModel.findOne({_id:key})
        await mem.set("h5_novel_adzone_dis_" + key, JSON.stringify(dis), 60*60)
    }
    return dis
}


async function get_book(bid) {
    let book = await mem.get("h5_novel_book_" + bid);
    if (book) {
        book = JSON.parse(book)
    } else {
        book = await BookModel.findOne({id:bid})
        await mem.set("h5_novel_book_" + bid, JSON.stringify(book), 10*60)
    }
    return book
}


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