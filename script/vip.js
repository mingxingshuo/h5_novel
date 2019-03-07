var UserModel = require('../model/User');
var send_tag_message = require('./send_tag_message');
var schedule = require("node-schedule");


function next_up(_id) {
    if (_id) {
        return find_vip(_id, next_up);
    } else {
        console.log('end');
        return;
    }
}

function user_vip() {
    find_vip(null, next_up);
}

async function find_vip(_id, next) {
    let messages = await UserModel.fetch(_id, async function (err, users) {
        for (let user of users) {
            if (Date.now() - Date.now(user.vip_time) >= 365 * 24 * 3600 * 1000) {
                await UserModel.findOneAndUpdate({unionid: user.unionid}, {isvip: 0})
            }
        }
        if (users.length == 1000) {
            return next(users[999]._id);
        } else {
            return next(null);
        }
    });
}

var rule = new schedule.RecurrenceRule();
var times = [1];
rule.hour = times;
var j = schedule.scheduleJob(rule, function () {
    user_vip()
});
