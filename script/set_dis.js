var DistributionModel = require('../model/Distribution');

async function dis() {
	let dis = new DistributionModel({
		title:'测试渠道1',
		adzones:{
			doumeng : {
				platform : "豆盟",
				adkey : "d60b63a746984b7ec0210492eddb3b79"
			},
			sougou : {
				platform : "搜狗",
				adkey : "1028619"
			}
		}
	})
	dis.save()
	console.log(dis)
}

dis()