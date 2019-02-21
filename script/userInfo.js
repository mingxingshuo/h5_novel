var schedule = require("node-schedule");
var UserModel = require('../model/User');
var ConfigModel = require('../model/Config');
var getClient = require('../util/get_weichat_client');
var async = require('async');
var mem = require('../util/mem.js');
var UserTagModel = require('../model/UserTag')

function next_up(_id, code, cb) {
    if (code) {
        return update_user(_id, code, next_up, cb);
    } else {
        console.log('update_user end');
        return cb(null)
    }
}


async function get_user() {
    let configs = await ConfigModel.find({status: 1})
    async.eachLimit(configs, 5, processer, function (error) {
        console.log('------5个任务执行结束---------')
        console.log(error)
    })
}

var processer = function (config, callback) {
    update_user(null, config.code, next_up, function (error, result) {
        console.log('-----callback byself------')
        return callback(error, result)
    })
}

var update_count = 0

async function update_user(_id, code, next, cb) {
    console.log(++update_count + ' ; update_count')
    await mem.set("updateUser_" + code, 1, 30 * 24 * 3600)
    UserModel.fetch_openid(_id, code, async function (error, users) {
        var user_arr = [];
        users.forEach(function (user) {
            user_arr.push(user.openid)
        })
        let client = await getClient.getClient(code)
        if (user_arr.length == 0) {
            console.log(user_arr, '-------------------user null')
            await mem.set("updateUser_" + code, 0, 30 * 24 * 3600)
            return next(null, null, cb)
        } else {
            client.batchGetUsers(user_arr, async function (err, data) {
                if (err) {
                    console.log(err, '----------------nickname err2')
                    if (users.length == 50) {
                        return next(users[49]._id, code, cb);
                    } else {
                        await mem.set("updateUser_" + code, 0, 30 * 24 * 3600)
                        return next(null, null, cb)
                    }
                }
                if (data && data.user_info_list) {
                    async.eachLimit(data.user_info_list, 10, function (info, callback) {
                        if (info.nickname) {
                            UserModel.findOneAndUpdate({openid: info.openid}, {
                                nickname: info.nickname,
                                headimgurl: info.headimgurl,
                                sex: info.sex.toString(),
                                country: info.country,
                                city: info.city,
                                province: info.province,
                                tag_sex: parseInt(info.sex)
                            }, function (err, result) {
                                if (err) {
                                    console.log(err)
                                }
                                callback(null)
                            });
                        } else {
                            callback(null)
                        }
                    }, async function (error) {
                        if (error) {
                            console.log(error, '--------------error')
                        }
                        if (users.length == 50) {
                            return next(users[49]._id, code, cb);
                        } else {
                            await mem.set("updateUser_" + code, 0, 30 * 24 * 3600)
                            return next(null, null, cb)
                        }
                    })
                }
            })
        }
    })
}

var rule = new schedule.RecurrenceRule();
var times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
rule.minute = times;
var j = schedule.scheduleJob(rule, function () {
    console.log('更新用户信息');
    get_user();
});