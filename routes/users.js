const router = require('koa-router')()
const UserModel = require('../model/User')
// var mem = require('../util/mem.js');

router.prefix('/user')

// router.get('/', async function (ctx, next) {
//   let user = await UserModel.find()
//   ctx.body = {
//     success: '成功',
//     data: user
//   }
// })
router.get('/all', async function (ctx, next) {
    let user = await UserModel.find()
    ctx.body = {success: '成功', data: user}
})

router.get('/', async function (ctx, next) {
    let unionid = ctx.request.query.unionid

    let user = await UserModel.findOne({unionid: unionid})
    ctx.body = {success: '成功', data: user}


    // let mem_user = await mem.get("novelUser_" + unionid)
    // if (mem_user) {
    //     let user = await UserModel.findOne({unionid: unionid})
    //     ctx.body = {success: '成功', data: user}
    // } else {
    //     ctx.body = {err: "您还没有登陆，请先登录"}
    // }
})

router.post('/login', async function (ctx, next) {
    let unionid = ctx.request.body.unionid
    let screen_name = ctx.request.body.screen_name
    let gender = ctx.request.body.gender
    let profile_image_url = ctx.request.body.profile_image_url
    let sex = 0
    if (gender == "男") {
        sex = 2
    } else if (gender == "女") {
        sex = 1
    }
    if (unionid) {
        let user = await UserModel.findOneAndUpdate({unionid: unionid}, {
            unionid: unionid,
            screen_name: screen_name,
            gender: sex,
            profile_image_url: profile_image_url,
            tag_sex: sex
        }, {upsert: true})
        ctx.body = {
            success: '成功',
            data: user
        }
    } else {
        ctx.body = {
            err: "登陆失败，unionid不能为空"
        }
    }
})

router.get('/shelf', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let id = ctx.request.query.id;
    let user = await UserModel.findOneAndUpdate({
        unionid: unionid
    }, {
        $addToSet: {
            shelf: id
        }
    }, {
        new: true
    })
    if (user) {
        ctx.body = {
            success: '成功',
            data: user
        }
    } else {
        ctx.body = {
            err: "添加到书架失败"
        }
    }
})

router.get('/unshelf', async function (ctx, next) {
    let unionid = ctx.request.query.unionid
    let id = ctx.request.query.id;
    let user = await UserModel.findOneAndUpdate({
        unionid: unionid
    }, {
        $pull: {
            shelf: id
        }
    }, {
        new: true
    })
    if (user) {
        ctx.body = {
            success: '成功',
            data: user
        }
    } else {
        ctx.body = {
            err: "从书架移除失败"
        }
    }
})

module.exports = router