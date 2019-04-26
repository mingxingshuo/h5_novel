const router = require('koa-router')()
const rp = require('request-promise');
const crypto = require('crypto');
var DistributionModel = require('../model/Distribution');
const mem = require("../util/mem")

router.prefix('/adzone')
module.exports = router

router.get('/:key/doumeng:item.js',async (ctx,next)=>{
	
	let accountId = '74658c19d9fb0c28f78ceb5f9df6f086';
	let secret ='d9fb0c28f78ceb5f';

	let dis = await get_dis(ctx.params.key)

	if(!dis || !dis.adzones.doumeng || !dis.adzones.doumeng.adkey){
		ctx.body = 'jsonp_doumeng_'+ctx.params.item+'("")'
		return
	}
	let adSpaceKey = dis.adzones.doumeng.adkey;
	let md5 = crypto.createHash('md5');

	let url = 'https://openapi.clotfun.online/openApi/advertisementAccess?accountId='
				+accountId+'&adSpaceKey='+adSpaceKey
	let sign = md5.update(accountId+adSpaceKey+secret).digest('hex');
	url += '&sign='+sign
	let body = await rp(url)
	body = JSON.parse(body)
	if(body.code == "200"){
		ctx.body = 'jsonp_doumeng_'+ctx.params.item+'('+JSON.stringify(body.result)+')'
	}else{
		ctx.body = 'jsonp_doumeng_'+ctx.params.item+'("")'
	}
})


router.get('/:key/sougou:item.js',async (ctx,next)=>{
	let dis = await get_dis(ctx.params.key)
	if(!dis || !dis.adzones.sougou || !dis.adzones.sougou.adkey){
		ctx.body = 'jsonp_sougou_'+ctx.params.item+'("")'
		return
	}
	let sougou_id = dis.adzones.sougou.adkey
	ctx.body = 'jsonp_sougou_'+ctx.params.item+'('+sougou_id+')'
})


async function get_dis(key) {
	if(!key || key=='undefined'){
		return null;
	}
	let dis = await mem.get("h5_novel_adzone_dis_" + key);
    if (dis) {
        dis = JSON.parse(dis)
    } else {
        dis = await DistributionModel.findOne({_id:key})
        await mem.set("h5_novel_adzone_dis_" + key, JSON.stringify(dis), 60*60)
    }
    return dis
}