const UserModel = require('../model/User')

user = new UserModel();
user.sex = '2';
user.unionid = '2';
user.balance = 100000;
user.action_time = Date.now();
user.save(function () {
    console.log({success: '成功', data: user})
})