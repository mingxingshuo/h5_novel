const router = require('koa-router')()
const UserModel = require('../model/User')
var mem = require('../util/mem');

router.prefix('/user')

router.get('/all', async function (ctx, next) {
    let user = await UserModel.find()
    ctx.body = {success: '成功', data: user}
})

router.get('/', async function (ctx, next) {
    let user = await UserModel.findOne({_id: ctx.id})
    ctx.body = {success: '成功', data: user}
})

router.post('/login', async function (ctx, next) {
    let uid = ctx.request.body.uid
    let deviceid = ctx.request.body.deviceid
    let screen_name = ctx.request.body.screen_name
    let gender = ctx.request.body.gender
    let profile_image_url = ctx.request.body.profile_image_url
    let sex = 0
    if (gender == "男") {
        sex = 2
    } else if (gender == "女") {
        sex = 1
    }
    if (uid) {
        let user = await UserModel.findOneAndUpdate({uid: uid}, {
            uid: uid,
            deviceid: deviceid,
            screen_name: screen_name,
            gender: sex,
            profile_image_url: profile_image_url,
            tag_sex: sex
        })
        await mem.set("uid_" + user.uid, '', 1);
        ctx.body = {
            success: '成功',
            data: user
        }
    } else {
        let user = await UserModel.findOneAndUpdate({device_id: device_id}, {
            uid: uid,
            deviceid: deviceid,
            screen_name: screen_name,
            gender: sex,
            profile_image_url: profile_image_url,
            tag_sex: sex
        })
        await mem.set("uid_" + user.deviceid, '', 1);
        ctx.body = {
            success: '成功',
            data: user
        }
    }
})

router.get('/balance', async function (ctx, next) {
    let id = ctx.request.query.id
    let balance = ctx.request.query.balance
    let user = await UserModel.findOneAndUpdate({_id: id}, {
        balance: balance
    })
    await mem.set("uid_" + user.uid, '', 1);
    if (user) {
        ctx.body = {
            success: '成功',
            data: user
        }
    } else {
        ctx.body = {
            err: "修改书币失败"
        }
    }
})

router.get('/shelf', async function (ctx, next) {
    let id = ctx.id
    let bid = ctx.request.query.bid;
    let user = await UserModel.findOneAndUpdate({_id: id}, {$addToSet: {shelf: bid}}, {new: true})
    await mem.set("uid_" + id, '', 1);
    await mem.set("deviceid_" + id, '', 1);
    if (user) {
        ctx.body = {
            success: '成功',
            data: user
        }
    } else {
        ctx.body = {
            err: "添加到书架失败"
        }
    }
})

router.get('/unshelf', async function (ctx, next) {
    let id = ctx.id;
    let bid = ctx.request.query.bid;
    let user = await UserModel.findOneAndUpdate({_id: id}, {$pull: {shelf: bid}}, {new: true})
    await mem.set("uid_" + id, '', 1);
    await mem.set("deviceid_" + id, '', 1);
    if (user) {
        ctx.body = {
            success: '成功',
            data: user
        }
    } else {
        ctx.body = {
            err: "从书架移除失败"
        }
    }
})

module.exports = router