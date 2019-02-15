const wrapper = require('co-mysql');
const mysql = require('mysql');
const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')

const options = {
    host: "47.93.11.180",
    port: 3306,
    database: "novel_baokuanto",
    user: "novel_baokuanto",
    password: "JwSA4drjt8rmGAcp"
}
const pool = mysql.createPool(options);
const p = wrapper(pool);
var book_arr = [3418, 3357]
async function getBook() {
    for (let i of book_arr) {
        let book = await p.query('select * from ien_book where id=' + i)
        let book_data = {
            origin_id: book[0].id,
            title: book[0].title,
            zuozhe: book[0].zuozhe,
            desc: book[0].desc,
            zishu: parseFloat(book[0].zishu) || 0,
            zhishu: parseFloat(book[0].zhishu) || 0,
            xstype: book[0].xstype || 0,
            tag_sex: parseInt(book[0].cid) || 2
        }
        let bookRes = await BookModel.create(book_data)
        let chapters = await p.query('select * from ien_chapter where bid=' + i + ' order by id asc')
        for (let chapter of chapters) {
            let chapter_data = {
                title: chapter.title,
                content: chapter.content,
                isvip: parseInt(chapter.isvip),
                bid: bookRes.id
            }
            await ChapterModel.create(chapter_data)
        }
    }
    console.log("get book success")
}

getBook()