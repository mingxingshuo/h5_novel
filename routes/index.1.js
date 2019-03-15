const router = require('koa-router')()
const http = require('http')
const request = require('request')
router.prefix('/')

async function httpRequest(url) {
  return new Promise((resolve, reject) =>{
    request.get(url, (err, res, body) => {
      let data = JSON.parse(body)
      resolve(data)
    })
  })
}

router.get('/account', async (ctx, next) => {
  console.log(ctx)
  let result = await httpRequest("http://localhost:3001/user")
  await ctx.render('pages/account', result.data);
})

router.get('/bookDetail', async (ctx, next) => {
  // 是否添加到书架
  let data = await httpRequest("http://localhost:3001/user")
  let id = ctx.request.query.id, read = {}
  let inShelf = data.data.shelf.indexOf(id) == -1 ? false : true
  // 获取书信息
  let info = await httpRequest("http://localhost:3001/book?id=" + id)
  // 是否有阅读记录
  let result = await httpRequest("http://localhost:3001/book/record?bid=" + id)
  if(info && result.data) {
    read = {
      id: result.data.cid,
      hasrecord: true
    }
  }else if(info) {
    read = {
      id: info.data.first,
      hasrecord: false
    }
  }
  let chapters = await httpRequest("http://localhost:3001/chapter/all?bid=" + id)
  await ctx.render('pages/bookDetail', {inShelf: inShelf, info: info.data.book, read: read, chapters: chapters.data.slice(0, 10)})
})

router.get('/bookShelf', async (ctx, next) => {
  let result = await httpRequest("http://localhost:3001/book/recordbook")
  let data;
  if(result) {
    data = await httpRequest("http://localhost:3001/book?id=" + result.data.bid)
  }
  let shelf = await httpRequest("http://localhost:3001/book/userbooks")
  await ctx.render('pages/bookShelf', {result: result.data, data: data.data.book, shelf: shelf.data})
})

router.get('/bookStore', async (ctx, next) => {
  await ctx.render('pages/bookStore')
})

router.get('/content', async (ctx, next) => {
  let id = ctx.request.query.id, isfirst, islast
  let data = await httpRequest("http://localhost:3001/chapter?id=" + id)
  let result = await httpRequest("http://localhost:3001/book?id=" + ctx.request.query.bid)
  
  if(result.data.first == id) {
    isfirst = true
  } else {
    isfirst = false
  }
  if(result.data.last == id) {
    islast = true
  } else {
    islast = false
  }
  await ctx.render('pages/content', {data: data.data, isfirst: isfirst, islast: islast})
})

router.get('/chapters', async (ctx, next) => {
  let result = await httpRequest("http://localhost:3001/chapter/all?bid=" + ctx.request.query.bid)
  let title = decodeURI(ctx.request.query.title)
  await ctx.render('pages/chapters', {data: result.data, title: title})
})

router.get('/record', async (ctx, next) => {
  await ctx.render('pages/record')
})

router.get('/recharge', async (ctx, next) => {
  await ctx.render('pages/recharge')
})


module.exports = router