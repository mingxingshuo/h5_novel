const router = require('koa-router')()
const rp = require('request-promise');
const crypto = require('crypto');

router.prefix('/adzone')
module.exports = router

router.get('/:key/doumeng:item.js',async (ctx,next)=>{
	
	let accountId = '74658c19d9fb0c28f78ceb5f9df6f086';
	let secret ='d9fb0c28f78ceb5f';

	// adSpaceKey 有待从Distribution 表里取出

	let adSpaceKey = 'd60b63a746984b7ec0210492eddb3b79';
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
	
	// sougou_id 有待从Distribution 表里取出
	let sougou_id = '1028619'
	ctx.body = 'jsonp_sougou_'+ctx.params.item+'('+sougou_id+')'
})
