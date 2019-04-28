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
    var index=1;
    var chapters =[]
    objReadline.on('line',function (line) {
        if(/第*章：/.test(line)){
        	console.log('---------开始加载---------'+line)
        	if(chapter&&chapter.title){
                chapter.index = index;
                index++;
        		chapters.push(chapter)
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
        if(chapters.length){
            save_chapters(chapters)
        }
    });
    objReadline.on('close',function () {
       if(chapters.length){
            save_chapters(chapters)
        }
        callback(null)
    });
}

var flag = false;
function save_chapters(chapters){
    if(flag){
        return
    }
    flag=true
    handle_chapters(chapters,function(){
        flag =false
    })
}

function handle_chapters(chapters,callback){
    var chapter = chapters.shift();
    chapter.save(function(){
        if(chapters.length){
            handle_chapters(chapters,callback)
        }else{
            callback()
        }
    })
}

book(__dirname+'/../book_txt/十月蛇胎.txt','十月蛇胎')