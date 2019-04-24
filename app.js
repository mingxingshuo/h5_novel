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
const order = require('./routes/order')
const qudao = require('./routes/channel')
const pay = require('./routes/pay')
const adzone = require('./routes/adzone')
// const alipay = require('./routes/alipay')
const rule = require('./routes/rule')
const UserModel = require('./model/User')
const mem = require('./util/mem')

const asyncRedis = require("async-redis");
const redis_client = asyncRedis.createClient();
 
redis_client.on("error", function (err) {
    console.log("redis Error " + err);
});

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
//app.use(cors());
app.use(json())
//app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))


app.use(async(ctx, next) => {
    ctx.set('Access-Control-Allow-Headers', 'content-type,xfilecategory,xfilename,xfilesize,u_id,device_id,uid,deviceid,X-Requested-With');
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
    if(ctx.url.indexOf('.')!=-1){
        await next()
        return 
    }
    let uid = ctx.cookies.get('h5_novels');
    //console.log(uid)
    let query_channel =ctx.query.channel;
    let channel;
    if(query_channel){
        ctx.cookies.set(
            'h5_channels',query_channel,{
                path:'/',       // 写cookie所在的路径
                maxAge: 100*12*30*24*60*60*1000,   // cookie有效时长
                expires:new Date(Date.now()+100*12*30*24*60*60*1000), // cookie失效时间
                httpOnly:false,  // 是否只用于http请求中获取
                overwrite:false  // 是否允许重写
            }
        );
        channel = query_channel
    }else{
        channel = ctx.cookies.get('h5_channels');
    }
    //console.log(channel)
    if(!uid){
        //生成uid，存储渠道号，存储期限无限长
        var  user = new UserModel({
            distribution:channel
        })
        await user.save();
        uid = user._id;
        ctx.cookies.set(
            'h5_novels',uid,{
                path:'/',       // 写cookie所在的路径
                maxAge: 100*12*30*24*60*60*1000,   // cookie有效时长
                expires:new Date(Date.now()+100*12*30*24*60*60*1000), // cookie失效时间
                httpOnly:false,  // 是否只用于http请求中获取
                overwrite:false  // 是否允许重写
            }
        );
        ctx.user = user
        ctx.id = user._id
    }else{
        let user = await mem.get("h5_novel_uid_" + uid);
        if (!user) {
            user = await UserModel.findOne({_id: uid})
            await mem.set("h5_novel_uid_" + uid, JSON.stringify(user), 10*60);
        }else{
            user = JSON.parse(user)
        }
        ctx.user = user
        ctx.id = user._id
    }
    await next()
    await redis_client.pfadd('h5novels_'+channel,uid)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(books.routes(), books.allowedMethods())
app.use(order.routes(), order.allowedMethods())
app.use(qudao.routes(), qudao.allowedMethods())
app.use(pay.routes(), pay.allowedMethods())
app.use(adzone.routes(), adzone.allowedMethods())
// app.use(alipay.routes(), alipay.allowedMethods())
app.use(rule.routes(), rule.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app
