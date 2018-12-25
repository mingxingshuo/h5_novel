let mongoose = require('mongoose');
let connect_url = require('../conf/proj.json').mongodb;
let dbs=[];

function getDB() {
	let count = dbs.length
	if(count <=30){
		let db = mongoose.createConnection(connect_url);
		dbs.push(db)
		return db
	}else{
		let index = parseInt(Math.random()*count)
		return dbs[index]
	}
}

module.exports.getDB = getDB