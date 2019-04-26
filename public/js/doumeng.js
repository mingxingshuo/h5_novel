var doumeng={}
doumeng.loadScript = function($e,key){
	var num = Math.random().toString(36).substr(2)
	window['jsonp_doumeng_'+num] = function (adzone) {
		if(!adzone){
		  	return
		}
		var $new = '<a class="jump_link" target="_top" href="'+adzone.adUrl+'" style="display: block;  z-index: 10;">'
		+'<img src="'+adzone.imageUrl+'" style="display: block; width: 100%;margin: .3rem 0;"></a>'
		$e.append($new)
	}
	var b = document.createElement("script");
    b.setAttribute('src','/adzone/'+key+'/doumeng'+num+'.js')
    document.body.appendChild(b)
}

doumeng.setelm = function($e,key){
	doumeng.loadScript($e,key)
}