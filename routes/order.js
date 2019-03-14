const router = require('koa-router')()
const OrderModel = require('../model/Order')

router.prefix('/order')


router.get('/all', async function (ctx, next) {
    let orders = await OrderModel.find()
    ctx.body = {success: '成功', data: orders}
})

router.get('/user', async function (ctx, next) {
    let user = ctx.user
    let orders = await OrderModel.find({u_id: user._id, status: 1}).sort({updateAt: -1})
    ctx.body = {success: '成功', data: orders}
})

router.get('/order', async function (ctx, next) {
    let order_number = ctx.request.query.order_number
    let order = await OrderModel.findOne({order_number: order_number})
    ctx.body = {success: '成功', data: order}
})

module.exports = router
