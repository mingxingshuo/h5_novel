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
const alipay = require('./routes/alipay')
const rule = require('./routes/rule')
const distribution = require('./routes/distribution')
const UserModel = require('./model/User')
const mem = require('./util/mem')
const userAgent = require('koa2-useragent');
const rp = require('request-promise');
var wx_conf = require('./conf/proj.json').wx_app;
const wxpay = require('./routes/wxpay')
const chapters = require('./routes/chapters')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
// app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cors());
app.use(json())
//app.use(logger())
app.use(require('koa-static')(__dirname + '/public'),{maxAge:1000*60*60})

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));
//app.set('view cache', true);

app.use(userAgent());


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
    }else if(ctx.url.indexOf('/pay')!=-1 || ctx.url.indexOf('/alipay')!=-1 || ctx.url.indexOf('/wxpay')!=-1){
        await next()
        return
    }
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
    if(!channel){
        ctx.cookies.set(
            'h5_channels','main',{
                path:'/',       // 写cookie所在的路径
                maxAge: 100*12*30*24*60*60*1000,   // cookie有效时长
                expires:new Date(Date.now()+100*12*30*24*60*60*1000), // cookie失效时间
                httpOnly:false,  // 是否只用于http请求中获取
                overwrite:false  // 是否允许重写
            }
        );
        channel = 'main'
    }
    ctx.channel = channel
    await next()
})

app.use(getOpenid);

app.use(async(ctx,next)=>{
    if(ctx.url.indexOf('.')!=-1){
        await next()
        return 
    }else if(ctx.url.indexOf('/pay')!=-1 || ctx.url.indexOf('/alipay')!=-1 || ctx.url.indexOf('/wxpay')!=-1){
        await next()
        return
    }
    if(ctx.userAgent.source.match(/MicroMessenger/i) == 'MicroMessenger'){
        //console.log('------is wechat---------')
        if(!ctx.openid){
            return await next()
        }
    }
    let uid = ctx.cookies.get('h5_novels');
    if(!uid){
        let  user;
        if(ctx.userAgent.isWechat){
            user = await UserModel.findOne({openid:ctx.openid})
        }
        if(!user){
            //生成uid，存储渠道号，存储期限无限长
            user = new UserModel({
                distribution:ctx.channel
            })
            if(ctx.userAgent.source.match(/MicroMessenger/i) == 'MicroMessenger'){
                user.openid = ctx.openid
            }
            await user.save();
        } 
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
    
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(books.routes(), books.allowedMethods())
app.use(order.routes(), order.allowedMethods())
app.use(qudao.routes(), qudao.allowedMethods())
app.use(pay.routes(), pay.allowedMethods())
app.use(adzone.routes(), adzone.allowedMethods())
app.use(alipay.routes(), alipay.allowedMethods())
app.use(rule.routes(), rule.allowedMethods())
app.use(distribution.routes(), distribution.allowedMethods())
app.use(wxpay.routes(), wxpay.allowedMethods())
app.use(chapters.routes(), chapters.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});


async function getOpenid(ctx,next){
    if(ctx.url.indexOf('.')!=-1){
        await next()
        return 
    }else if(ctx.url.indexOf('/pay')!=-1 || ctx.url.indexOf('/alipay')!=-1 || ctx.url.indexOf('/wxpay')!=-1){
        await next()
        return
    }
    //console.log('-----是否微信打开-------')
    //console.log(ctx.userAgent.source.match(/MicroMessenger/i) == 'MicroMessenger')
    if(!(ctx.userAgent.source.match(/MicroMessenger/i) == 'MicroMessenger')){
        console.log('------no wechat---------')
        return await next()
    }
    let openid = ctx.cookies.get('h5_novel_ctx_openid_'+ctx.channel);
    //console.log('openid-------',openid)
    if(!openid){
        console.log('-----ctx.query.uuu-----')
        console.log(ctx.query.uuu);
        openid = ctx.query.uuu;
        if(openid){
            ctx.cookies.set('h5_novel_ctx_openid_'+ctx.channel,openid);
        }
    }
    let code = ctx.query.code;
    let config = wx_conf;
    if(!openid){
        /*req.session.openid = 'o3qBK0RXH4BlFLEIksKOJEzx08og';
        return callback(req,res);*/
        if(!code){
            console.log('------go to get code-------')
            console.log('http://'+ctx.hostname+ctx.originalUrl)
            let url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+config
            .appid+"&redirect_uri="+encodeURIComponent('http://'+ctx.hostname+ctx.originalUrl)+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
            ctx.redirect(url);
        }else{
            let api_url="https://api.weixin.qq.com/sns/oauth2/access_token?appid="+config
            .appid+"&secret="+config
            .appsecret+"&code="+code+"&grant_type=authorization_code";
            let body = await rp({
                uri:api_url,
                json:true
            });
            ctx.cookies.set('h5_novel_ctx_openid_'+ctx.channel,body.openid);
            console.log('-------get  openid---------')
            console.log(body.openid)
            ctx.openid = body.openid
            await next()
        }
    }else{
        ctx.openid = openid
        await next()
    }
}


module.exports = app
