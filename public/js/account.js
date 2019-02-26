$(function() {
  getUsers()
  toPayPage()
})


// 获取用户信息
function getUsers() {
  let unionid = getCookie("user_unionid")
  if(unionid) {
    httpRequest("/user", "get", {unionid: unionid}, function(res) {
      let user = res.data
      renderUser(user)
    })
  } else {
    httpRequest("/user", "get", {unionid: '1'}, function(res) {
      let user = res.data
      renderUser(user)
      setCookie("user_unionid", user.unionid)
    })
  }
  
}

// 渲染用户信息
function renderUser(user) {
  // $(".user-name").text(user.nickname)
  $(".shubi span").text(user.balance)
}

// 页面跳转
function toPayPage() {
  $(".chongzhi button").click(function() {
    window.location.href = "./recharge"
  })
  $(".record").click(function() {
    window.location.href = "./record"
  })
}