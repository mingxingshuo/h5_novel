const UserModel = require('../model/User')

async function a() {
    let user = await UserModel.findOne({unionid: '1'})
    user.update({
        $addToSet: {pay_chapter: 1540},
        $inc: {balance: -30}
    })
    user.save()
    console.log(user, '------------------user')
}
a()
