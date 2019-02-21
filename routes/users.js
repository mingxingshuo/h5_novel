const router = require('koa-router')()
const wechat_util = require('../util/get_weichat_client')
const UserModel = require('../model/User')
var mem = require('../util/mem.js');

router.prefix('/user')

router.get('/', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let mem_user = await mem.get("novelUser_" + unionid)
    if (mem_user) {
        let user = await UserModel.findOne({unionid: unionid})
        ctx.body = {success: '成功', data: user}
    } else {
        ctx.body = {err: "您还没有登陆，请先登录"}
    }
})

router.get('/login', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let openid = ctx.request.query.openid
    let code = ctx.request.query.code
    let user = await UserModel.findOne({unionid: unionid})
    if(unionid) {
        if (user) {
            await mem.set("novelUser_" + unionid, 1, 24 * 3600)
            ctx.body = {success: '成功', data: user}
        } else {
            await mem.set("novelUser_" + unionid, 1, 24 * 3600)
            user = new UserModel();
            user.nickname = '';
            user.sex = '0';
            user.openid = openid;
            user.unionid = unionid;
            user.code = code;
            user.balance = 0;
            user.action_time = Date.now();
            user.save(function () {
                ctx.body = {success: '成功', data: user}
            })
        }
    }else{
        ctx.body = {err: "登陆失败，unionid不能为空"}
    }
})

router.get('/logout', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let user = await UserModel.findOne({unionid: unionid})
    if (user) {
        await mem.set("novelUser_" + unionid, 0, 1)
        ctx.body = {success: '成功', data: user}
    } else {
        ctx.body = {err: "退出登陆失败"}
    }
})

router.get('/shelf', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let id = ctx.request.query.id;
    let user = await UserModel.findOneAndUpdate({unionid: unionid}, {
        $addToSet: {shelf: id}
    }, {new: true})
    if (user) {
        ctx.body = {success: '成功', data: user}
    } else {
        ctx.body = {err: "添加到书架失败"}
    }
})

router.get('/unshelf', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let id = ctx.request.query.id;
    let user = await UserModel.findOneAndUpdate({unionid: unionid}, {
        $pull: {shelf: id}
    }, {new: true})
    if (user) {
        ctx.body = {success: '成功', data: user}
    } else {
        ctx.body = {err: "从书架移除失败"}
    }
})

module.exports = router
