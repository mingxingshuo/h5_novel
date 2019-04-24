const router = require('koa-router')()
const BookModel = require('../model/Book')
const InfoModel = require('../model/Info')
const multer = require('koa-multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log('destination');
        cb(null, __dirname + '/../public/uploads/')
    },
    filename: function (req, file, cb) {
        //console.log('filename');
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var upload = multer({storage: storage});

router.prefix('/info')

router.post('/upload', upload.single('imageFile'), async(ctx, next) => {
    ctx.body = {url: ctx.req.file.filename};
});

router.get('/', async function (ctx, next) {
    let info = await InfoModel.find()
    ctx.body = {success: '成功', data: info}
})

router.post('/update', async function (ctx, next) {
    let bid = ctx.request.body.bid
    let url = ctx.request.body.url
    let title = ctx.request.body.title
    let book = await BookModel.findOne({id: id})
    let docs = await InfoModel.findByIdAndUpdate(bid, {url: url, title: title, book_title: book.title}, {new: true});
    if (docs) {
        ctx.body = {success: '成功', data: docs}
    } else {
        ctx.body = {err: '修改失败，请检查输入是否有误'}
    }
})

module.exports = router
