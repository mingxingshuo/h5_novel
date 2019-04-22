const BookModel = require('../model/Book')
const ChapterModel = require('../model/Chapter')
var fs = require('fs');
var readline = require('readline');

async function book(filename,bookname) {
	let book = new BookModel({title:bookname})
	await book.save()
	readFileToChapter(filename,book.id,function(){
		console.log('__________完毕！____________')
	})
}


function readFileToChapter(filename,bid,callback){
    var fRead = fs.createReadStream(filename);
    var objReadline = readline.createInterface({
        input:fRead
    });
    var chapter;
    objReadline.on('line',function (line) {
        if(/第*章：/.test(line)){
        	console.log('---------开始加载---------'+line)
        	if(chapter&&chapter.title){
        		chapter.save(function(err){
        			if(err){
        				console.log(err)
        			}	
        		})
        		chapter = new ChapterModel({bid:bid})
        	}else{
        		chapter = new ChapterModel({bid:bid})
        	}
        	chapter.title = line
        }else{
        	if(chapter.content){
        		chapter.content += '<p>'+line+'</p></br>'
        	}else{
        		chapter.content = '<p>'+line+'</p></br>'
        	}
        	
        }
    });
    objReadline.on('close',function () {
       callback()
    });
}


book(__dirname+'/../book_txt/十月蛇胎.txt','十月蛇胎')