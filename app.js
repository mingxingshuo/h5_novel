const Koa = require('koa')
//const cors = require('koa2-cors');
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const books = require('./routes/books')
const chapters = require('./routes/chapters')
const order = require('./routes/order')
const qudao = require('./routes/qudao')
const pay = require('./routes/pay')
const UserModel = require('./model/User')
const mem = require('./util/mem')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
//app.use(cors());
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))


app.use(async(ctx, next) => {
    ctx.set('Access-Control-Allow-Headers', 'content-type,xfilecategory,xfilename,xfilesize,u_id,device_id,uid,deviceid');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET,OPTIONS');
    if (ctx.request.method == "OPTIONS") {
        ctx.response.status = 200
    }
    await next();
});

// logger
app.use(async(ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(async(ctx, next) => {
    let uid = ctx.request.headers.uid
    let deviceid = ctx.request.headers.deviceid
    if (uid) {
        let user = await mem.get("uid_" + uid);
        console.log(user,'-------------------user1')
        if (!user) {
            user = await UserModel.findOne({_id: uid})
            console.log(user,'-------------------user2')
            await mem.set("uid_" + uid, user, 24 * 3600);
        }
        ctx.user = user
        ctx.id = user._id
    } else if (deviceid) {
        let user = await mem.get("deviceid_" + deviceid);
        console.log(user,'-------------------user1')
        if (!user) {
            user = await UserModel.findOne({deviceid: deviceid})
            console.log(user,'-------------------user2')
            if (!user) {
                user = await UserModel.create({deviceid: deviceid})
                console.log(user,'-------------------user3')
            }
            await mem.set("deviceid_" + deviceid, user, 24 * 3600);
        }
        ctx.id = user._id
    }
    await next()
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(books.routes(), books.allowedMethods())
app.use(chapters.routes(), chapters.allowedMethods())
app.use(order.routes(), order.allowedMethods())
app.use(qudao.routes(), qudao.allowedMethods())
app.use(pay.routes(), pay.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
