var $elm;
var loadScript = function(){
	var num = Math.random().toString(36).substr(2)
	window['jsonp_'+num] = function (adzone) {
		var $new = '<a class="jump_link" target="_top" href="'+adzone.adUrl+'" style="display: block;  z-index: 10;">'
		+'<img src="'+adzone.imageUrl+'" style="display: block; width: 100%;margin: .3rem 0;"></a>'
		$elm.append($new)
	}
	var b = document.createElement("script");
    b.setAttribute('src','/adzone/doumeng'+num+'.js')
    document.body.appendChild(b)
}

var setelm = function($e){
	$elm = $e
	loadScript()
}

