const router = require('koa-router')()
const UserModel = require('../model/User')

router.prefix('/users')

router.get('/', async function (ctx, next) {
    let docs = await UserModel.find()
    ctx.body = docs
})

router.post('/create', async (ctx,next)=>{
    let data = {
        openid: ctx.request.body.openid,
        nickname: ctx.request.body.nickname,
        unionid:ctx.request.body.unionid,
        sex: ctx.request.body.sex,
        province: ctx.request.body.province,
        city: ctx.request.body.city,
        country: ctx.request.body.country,
        headimgurl: ctx.request.body.headimgurl,
        action_time:Date.now()
    }
    let docs = await UserModel.create(data);
    if (docs) {
        ctx.body= {success: '成功', data: docs}
    } else {
        ctx.body= {err: '创建失败，请检查输入是否有误'}
    }
})

router.post('/update', async (ctx,next)=>{
    let id = ctx.request.body.id;
    let data = {
        openid: ctx.request.body.openid,
        nickname: ctx.request.body.nickname,
        unionid:ctx.request.body.unionid,
        sex: ctx.request.body.sex,
        province: ctx.request.body.province,
        city: ctx.request.body.city,
        country: ctx.request.body.country,
        headimgurl: ctx.request.body.headimgurl,
        action_time:Date.now()
    }
    let docs = await UserModel.findByIdAndUpdate(id,data)
    if (docs) {
        ctx.body= {success: '修改成功', data: docs}
    } else {
        ctx.body= {err: '修改失败'}
    }
})

router.get('/delete',async (ctx,next)=>{
    let id = ctx.request.query.id;
    await UserModel.findByIdAndDelete(id)
    let docs1 = await UserModel.find()
    ctx.body = {success: '删除成功', data: docs1}
})

module.exports = router
