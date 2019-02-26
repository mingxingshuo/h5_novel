$(function() {
  getBookList()
  detailClick()
})

// 获取所有书籍
function getBookList() {
  httpRequest("/book/all", "get", {}, function(res) {
    renderBookList(res.data)
  })
}

// 渲染所有书籍
function renderBookList(data) {
  let html = ""
  $.each(data, function(i, el) {
    html += `
      <li data-id="${el.id}" class="book_item">
        <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=702693500,4139197472&fm=58" alt="" srcset="">
        <div class="book_info">
          <span class="title">${el.title}</span>
          <span class="desc">${el.desc}</span>
          <span style="font-size: .3rem;">
            <span class="${el.xstype == 1 ? 'blue' : 'red'}">
              ${el.xstype == 1 ? '已完结' : '连载中'}
            </span>
            | 都市
          </span>
        </div>
      </li>
    `
  });
  $(".book_list").append(html)
}

// 跳转书籍详情页
function detailClick() {
  $(".book_list").on("click", "li", function() {
    let id = $(this).attr("data-id");
    window.location.href = "./bookDetail?id=" + id
  })
}