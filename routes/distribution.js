const router = require('koa-router')()
const DistributionModel = require('../model/Distribution')
const multer = require('koa-multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/../public/distributions/')
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var upload = multer({ storage: storage });

router.prefix('/distribution')

router.post('/upload', upload.single('imageFile'), async(ctx, next) => {
    ctx.body = {image_url: ctx.req.file.filename};
});

router.get('/all', async function (ctx, next) {
    let page = ctx.request.query.page || 1
    let distribution = await DistributionModel.find().skip((page - 1) * 10).limit(10)
    ctx.body = {success: '成功', data: distribution}
})

router.get('/', async function (ctx, next) {
    let id = ctx.request.query.id;
    let distribution = await DistributionModel.findOne({id: id})
    ctx.body = {success: '成功', data: distribution}
})

router.post('/create', async function (ctx, next) {
    let title = ctx.request.body.title
    let official = ctx.request.body.official
    let docs = await DistributionModel.create({title: title, official: official});
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '创建失败，请检查输入是否有误'}
    }
})

router.post('/update', async function (ctx, next) {
    let id = ctx.request.body.id
    let title = ctx.request.body.title
    let official = ctx.request.body.official
    let docs = await DistributionModel.findByIdAndUpdate(id, {title: title, official: official}, {new: true});
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '修改失败，请检查输入是否有误'}
    }
})

router.get('/delete', async(ctx, next) => {
    var id = ctx.request.query.id;
    var docs = await DistributionModel.findByIdAndRemove(id)
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '删除失败'}
    }
})

router.get('/adzones', async function (ctx, next) {
    let id = ctx.request.query.id;
    let distribution = await DistributionModel.findOne({id: id})
    let data = {
        _id: distribution._id,
        title : distribution.title
    }
    data.keys = ['doumeng','sougou']
    data.list=[]
    for(key in distribution.adzones){
        data.list.push({
            key : key,
            platform : distribution.adzones[key].platform,
            adkey : distribution.adzones[key].adkey
        })
    }
    ctx.body = {success: '成功', data: data}
})

router.post('/update/adzones', async function (ctx, next) {
    let id = ctx.request.body.id
    let adzone_list = ctx.request.body.adzone_list
    let adzones = {}
    for (var i = 0; i < adzone_list.length; i++) {
        let adzone_item = adzone_list[i]
        adzones[adzone_item.key] = {
            platform : adzone_item.platform,
            adkey : adzone_item.adkey
        }
    }
    let docs = await DistributionModel.findByIdAndUpdate(id, {adzones:adzones}, {new: true});
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '修改失败，请检查输入是否有误'}
    }
})


module.exports = router
