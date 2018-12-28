const router = require('koa-router')()
const BookModel = require('../model/Book')

router.prefix('/book')

router.get('/all', async function (ctx, next) {
    let book = await BookModel.find()
    ctx.body = book
})

router.get('/', async function (ctx, next) {
  let id = ctx.request.query.id;
  let book = await BookModel.find({id:id})
  ctx.body = book
})

router.get('/reset', async(ctx, next) => {
    var book = new BookModel()
    book.nextCount(function (err, count) {
        book.resetCount(function (err, nextCount) {
        });
    });
    ctx.body = {success: '重置成功'}
})

module.exports = router
