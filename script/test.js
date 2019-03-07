const UserModel = require('../model/User')
const BookModel = require('../model/Book')


async function a() {
    // let user = await UserModel.findOne({unionid: '1'})
    // console.log(user,'------------------1')
    // await UserModel.findOneAndUpdate({unionid:'1'},{
    //     $addToSet: {pay_chapter: 1740},
    //     $inc: {balance: -30}
    // })
    // for(let i of [3418, 3357, 3424, 3423, 3422, 600, 599, 598, 597, 596]){
    //     await BookModel.findOneAndUpdate({origin_id:i},{image:'http://novel.oorggt.top/public/uploads/images/20181210/3f2238335a3ba61f6b4e082d45f44fe6.jpeg'})
    // }
    await BookModel.findOneAndUpdate({origin_id: 596}, {image: 'http://novel.oorggt.top/public/uploads/images/20181210/3f2238335a3ba61f6b4e082d45f44fe6.jpeg'})
    await BookModel.findOneAndUpdate({origin_id: 597}, {image: 'http://novel.oorggt.top/public/uploads/images/20181210/6be57f25663a5fceadb76d2ad0e5fbb2.jpeg'})
    await BookModel.findOneAndUpdate({origin_id: 598}, {image: 'http://novel.oorggt.top/public/uploads/images/20181210/a1e81e6d9734c8074354ae93ea2ed1da.jpeg'})
    await BookModel.findOneAndUpdate({origin_id: 599}, {image: 'http://novel.oorggt.top/public/uploads/images/20181210/9ade63a65c45fe8f933b92bcd8837537.jpeg'})
    await BookModel.findOneAndUpdate({origin_id: 600}, {image: 'http://novel.oorggt.top/public/uploads/images/20181210/68834a4edf9b7fafd5bed9ee886d20fe.jpeg'})
    await BookModel.findOneAndUpdate({origin_id: 3422}, {image: 'http://novel.oorggt.top/public/uploads/images/20181229/e1051fe3c919dae123b7eb369ac71a2f.jpg'})
    await BookModel.findOneAndUpdate({origin_id: 3423}, {image: 'http://novel.oorggt.top/public/uploads/images/20181229/4063f20d6d188383fb4551c87f034c10.jpg'})
    await BookModel.findOneAndUpdate({origin_id: 3424}, {image: 'http://novel.oorggt.top/public/uploads/images/20190102/124580b1ba9cc825e80ae5ede1e2670d.jpg'})
    await BookModel.findOneAndUpdate({origin_id: 3357}, {image: 'http://novel.oorggt.top/public/uploads/images/20181217/5740a6182c4fc4d49c7433398b61f473.jpg'})
    await BookModel.findOneAndUpdate({origin_id: 3418}, {image: 'http://novel.oorggt.top/public/uploads/images/20181221/cafc1cec56fe68cfdd6a7a95d3b171cc.jpg'})
}
a()
