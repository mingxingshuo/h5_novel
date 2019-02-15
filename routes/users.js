const router = require('koa-router')()
const wechat_util = require('../util/get_weichat_client')
const UserModel = require('../model/User')
var mem = require('../util/mem.js');

router.prefix('/user')

router.get('/', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let mem_user = await mem.get("novelUser_" + unionid)
    if(mem_user){
        let user = await UserModel.findOne({unionid: unionid})
        ctx.body = user
    }else{
      ctx.body = "未登陆"
    }
})

router.get('/login', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let user = await UserModel.findOne({unionid: unionid})
    if(user){
        await mem.set("novelUser_" + unionid, 1, 24 * 3600)
        let client = await wechat_util.getClient(code)
        ctx.body = '登陆成功'
    }else{
        ctx.body = '登陆失败'
    }
})

router.get('/logout', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let user = await UserModel.findOne({unionid: unionid})
    if(user){
        await mem.set("novelUser_" + unionid, 0, 24 * 3600)
        let client = await wechat_util.getClient(code)
        ctx.body = '退出登陆成功'
    }else{
        ctx.body = '退出登陆失败'
    }
})

router.get('/shelf', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let id = ctx.request.query.id;
    await UserModel.findOneAndUpdate({unionid: unionid},{
        $addToSet: {shelf: id}
    })
    ctx.body = "添加至书架成功"
})

router.get('/unshelf', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let id = ctx.request.query.id;
    await UserModel.findOneAndUpdate({unionid: unionid},{
        $pull: {shelf: id}
    })
    ctx.body = "从书架移除成功"
})

module.exports = router
