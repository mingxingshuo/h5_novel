var BookPayRuleModel = require('../model/BookPayRule');

var ChapterModel = require('../model/Chapter');

async function setbook(bid,start,end,price) {
	let starts = await ChapterModel.find({bid:bid},{id:1}).sort({id: 1}).skip(start-1).limit(1)
	let ends = await ChapterModel.find({bid:bid},{id:1}).sort({id: 1}).skip(end-1).limit(1)
	console.log(starts)
	
	await BookPayRuleModel.create({
		bid:bid,
		start:starts[0].id,
		end: ends[0].id,
		price : price,
		start_index : start,
		end_index :end
	})
}

async function getrule(bid){
	let rules = await BookPayRuleModel.find({bid:bid})
	console.log(rules)
	let count = await ChapterModel.count({bid:bid})
	console.log(count)
}

//getrule(15)
//setbook(4,1,10,0)
//setbook(4,11,30,0.5)
//setbook(4,31,80,1)