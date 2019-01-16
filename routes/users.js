const router = require('koa-router')()
const wechat_util = require('../util/get_weichat_client')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is 240 users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is 240 users/bar response'
})

module.exports = router
