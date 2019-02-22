const router = require('koa-router')()
const ChapterModel = require('../model/Chapter')
const UserModel = require('../model/User')

router.prefix('/chapter')
var price = 30

router.get('/all', async function (ctx, next) {
  let bid = ctx.request.query.bid;
  let chapter = await ChapterModel.find({
    bid: bid
  })
  ctx.body = {
    success: '成功',
    data: chapter
  }
})

router.get('/', async function (ctx, next) {
  let id = ctx.request.query.id
  let unionid = ctx.request.query.unionid
  let chapter = await ChapterModel.findOne({
    id: id
  })
  let user = await UserModel.findOne({
    unionid: unionid
  })
  // let mem_user = await mem.get("novelUser_" + unionid)
  // console.log(id, unionid, chapter, user, '---------------------chapter')
  // if (!mem_user) {
  //     return ctx.body = {err: "请先登录"}
  // }
  if (!chapter.isvip) {
    console.log(0)
    return ctx.body = {
      success: '成功',
      data: chapter
    }
  }
  if (user.isvip) {
    console.log(1)
    return ctx.body = {
      success: '成功',
      data: chapter
    }
  }
  let pay_chapter = user.pay_chapter.indexOf(id)
  if (pay_chapter != -1) {
    console.log(2)
    return ctx.body = {
      success: '成功',
      data: chapter
    }
  } else {
    if (user.balance > price) {
      UserModel.findOneAndUpdate({unionid: unionid},{
        $addToSet: {
          pay_chapter: id
        },
        $inc: {
          balance: -price
        }
      })
      console.log(3)
      return ctx.body = {
        success: '成功',
        data: chapter
      }
    } else {
      console.log(4)
      return ctx.body = {
        err: "您的余额不足，请及时充值"
      }
    }
  }
})

router.get('/reset', async (ctx, next) => {
  var chapter = new ChapterModel()
  chapter.nextCount(function (err, count) {
    chapter.resetCount(function (err, nextCount) {});
  });
  ctx.body = {
    success: '重置成功'
  }
})


module.exports = router