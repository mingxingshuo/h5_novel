const router = require('koa-router')()
const UserModel = require('../model/User')
const UserShelfModel = require('../model/UserShelf')
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
    let uid = ctx.id
    let channel = ctx.request.body.channel
    // let sex = 0
    // if (gender == "男") {
    //     sex = 2
    // } else if (gender == "女") {
    //     sex = 1
    // }
    let user = await UserModel.findOneAndUpdate({_id: uid}, {
        // tag_sex: sex,
        channel: channel
    })
    await mem.set("uid_" + user._id, '', 1);
    ctx.body = {
        success: '成功',
        data: user
    }
})

router.get('/balance', async function (ctx, next) {
    let id = ctx.request.query.id
    let balance = ctx.request.query.balance
    let user = await UserModel.findOneAndUpdate({_id: id}, {
        balance: balance
    })
    await mem.set("uid_" + user._id, '', 1);
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
    let shelf = await UserShelfModel.create({u_id: id, bid: bid})
    await mem.set("uid_" + user._id, '', 1);
    if (shelf) {
        ctx.body = {
            success: '成功',
            data: shelf
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
    let shelf = await UserShelfModel.remove({u_id: id, bid: bid})
    await mem.set("uid_" + user._id, '', 1);
    if (shelf) {
        ctx.body = {
            success: '成功',
            data: shelf
        }
    } else {
        ctx.body = {
            err: "从书架移除失败"
        }
    }
})

module.exports = router