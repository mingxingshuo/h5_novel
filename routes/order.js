const router = require('koa-router')()
const OrderModel = require('../model/Order')
const UserModel = require('../model/User')

router.prefix('/order')

router.get('/', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let user = await UserModel.findOne({unionid: unionid})
    let orders = await OrderModel.find({u_id: user._id, status: 1}).sort({updateAt: -1})
    ctx.body = {success: '成功', orders: orders}
})

module.exports = router
