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
    let docs = await DistributionModel.findByIdAndUpdate(id, {title: title, official: official}, {new: true});
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '修改失败，请检查输入是否有误'}
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

module.exports = router
