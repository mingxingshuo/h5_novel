(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{448:function(e,a,t){"use strict";t.r(a);var n=t(22),i=t(23),l=t(25),o=t(24),r=t(26),c=t(0),p=t.n(c),u=t(141),s=t(51),h=t(387),m=t(389),d=t(450),f=t(11),g=t(144),b=t(30),y=t(62),C=function(e){function a(){return Object(n.a)(this,a),Object(l.a)(this,Object(o.a)(a).apply(this,arguments))}return Object(r.a)(a,e),Object(i.a)(a,[{key:"render",value:function(){var e=this,a=this.props,t=a.title,n=a.official,i=a.changeChannelInput,l=a.changeGonghaoInput,o=a.uploadImage,r=a.handleCreate,c=a.handleUpdate,u=a.location,g={action:b.a+"/distribution/upload",onChange:o,showUploadList:!1,name:"imageFile"},y=u.search?p.a.createElement(s.a,{style:{marginRight:"20px"},type:"primary",onClick:function(){c(e.props)}},"\u4fee\u6539"):p.a.createElement(s.a,{style:{marginRight:"20px"},type:"primary",onClick:function(){r(e.props)}},"\u521b\u5efa");return p.a.createElement(h.a,{labelCol:{sm:{span:3}},wrapperCol:{sm:{span:8}}},p.a.createElement(h.a.Item,{label:"\u6e20\u9053\u540d\u79f0"},p.a.createElement(m.a,{value:t,onChange:i,placeholder:"\u8bf7\u8f93\u5165\u6e20\u9053\u540d\u79f0"})),p.a.createElement(h.a.Item,{label:"\u516c\u53f7\u540d\u79f0"},p.a.createElement(m.a,{value:n.name,onChange:l,placeholder:"\u8bf7\u8f93\u5165\u516c\u53f7\u540d\u79f0"})),p.a.createElement(h.a.Item,{label:"\u516c\u53f7\u56fe\u7247"},p.a.createElement(d.a,g,""===n.image?p.a.createElement(s.a,null,p.a.createElement(f.a,{type:"upload"}),"\u4e0a\u4f20\u56fe\u7247"):p.a.createElement("img",{style:{width:"200px"},src:n.image,alt:""}))),p.a.createElement(h.a.Item,{style:{marginLeft:"100px"}},y,p.a.createElement(s.a,{type:"danger",onClick:function(){return e.props.history.goBack()}},"\u53d6\u6d88")))}},{key:"componentDidMount",value:function(){if(this.props.location.search){var e=decodeURI(this.props.location.search);e=JSON.parse(e.split("=")[1]),this.props.initState(e)}}},{key:"componentWillUnmount",value:function(){this.props.resetState()}}]),a}(c.PureComponent);a.default=Object(u.b)(function(e){return{title:e.channel.title,official:e.channel.official,id:e.channel.id}},function(e){return{changeChannelInput:function(a){var t=a.target.value;e(g.a.changeChannelInput(t))},changeGonghaoInput:function(a){var t=a.target.value;e(g.a.changeGonghaoInput(t))},uploadImage:function(a){if("done"===a.file.status){var t=b.a+"/distributions/"+a.file.response.image_url;e(g.a.uploadImage(t))}},handleCreate:function(a){e(g.a.handleCreate(a))},initState:function(a){e(g.a.initState(a))},handleUpdate:function(a){e(g.a.handleUpdate(a))},resetState:function(){e(g.a.resetState())}}})(Object(y.e)(C))}}]);
//# sourceMappingURL=7.fa090249.chunk.js.map