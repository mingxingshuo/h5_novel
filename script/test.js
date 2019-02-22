const UserModel = require('../model/User')

async function a() {
    let user = await UserModel.findOne({unionid: '1'})
    console.log(user,'------------------1')
    await UserModel.findOneAndUpdate({unionid:'1'},{
        $addToSet: {pay_chapter: 1740},
        $inc: {balance: -30}
    })
}
a()
