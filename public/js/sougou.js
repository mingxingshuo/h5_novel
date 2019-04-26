var sougou={}
sougou.loadScript = function($e,key){
	var num = Math.random().toString(36).substr(2)
	window['jsonp_sougou_'+num] = function (sougou_id) {
	  if(!sougou_id){
	  	return
	  }
	  $e.attr('id','sogou_wap_'+sougou_id)
	  window.sogou_un = window.sogou_un || [];
	  window.sogou_un.push({id: sougou_id,ele:$e[0]});
	}
	var b = document.createElement("script");
    b.setAttribute('src','/adzone/'+key+'/sougou'+num+'.js')
    document.body.appendChild(b)
}

sougou.setelm = function($e,key){
	sougou.loadScript($e,key)
}