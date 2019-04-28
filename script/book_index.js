const ChapterModel = require('../model/Chapter')

async function book_index(bid) {
	fetch_book(null,bid,0)
}

async function fetch_book(id,bid,index){
	console.log('--------打印章节-------')
	console.log(index)
    let chapters;
    if(id){
        chapters = await ChapterModel.find({bid:bid,id: {$gt: id} },{id:1,index:1}).sort({id:1}).limit(50)
    }else{
        chapters = await ChapterModel.find({bid:bid},{id:1,index:1}).sort({id:1}).limit(50)
    }
    for (var i = 0; i < chapters.length; i++) {
    	index++
    	chapters[i].index = index
    	await chapters[i].save()
    }
    if(chapters.length==50){
    	fetch_book(chapters[49].id,bid,index)
    }else{
    	console.log('--------章节结束-------')
    }
    
}

book_index(5)