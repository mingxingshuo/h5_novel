$(function() {
  $(".recharge-list").on("click", "li", function() {
    $(this).siblings('li').removeClass('selected');  // 删除其他兄弟元素的样式
    $(this).addClass('selected');
  })
  $(".submit").click(function() {
    let price = $(".recharge-list li.selected").attr("data-price")
    httpRequest("/user/pay", "post", {}, function(res) {
      if(res.success) {
        console.log(res.data)
      }
    })
  })
})