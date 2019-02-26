$(function() {
  let unionid = getCookie("user_unionid")
  getRecentRecord(unionid)
  getBookList(unionid)
  detailClick(unionid)
})

// 获取最新的阅读记录
function getRecentRecord(unionid) {
  httpRequest("/book/recordbook", "get", {unionid: unionid}, function(res) {
    httpRequest("/book", "get", {
      id: res.data.bid
    }, function (response) {
      let data = response.data.book
      renderRecentRecord(data);
      $(".continue").click(function() {
        window.location.href = "./content?id=" + res.data.cid + "&bid=" + res.data.bid + "&title=" + data.title;
      })
    })
  })
}

// 渲染最近阅读记录
function renderRecentRecord(data) {
  let read_continue = `
        <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=702693500,4139197472&fm=58" alt="">
        <div class="read-info">
          <span class="title">${data.title}</span>
          <span style="font-size: .27rem;margin: .3rem 0;">
          <span class="${data.xstype == 1 ? "blue" : "red"}">${data.xstype == 1 ? "已完结" : "连载中"}</span>
           | ${data.type == 1 ? "都市" : ""}
          </span>
          <div class="continue">继续阅读</div>
        </div>
      `;
  $(".read-continue").append(read_continue);
}

// 获取用户书架列表
function getBookList(unionid) {
  httpRequest("/book/userbooks", "get", {unionid: unionid}, function(res) {
    if(res.data.length !== 0) {
      renderBookList(res.data)
    }
  })
}

// 渲染用户书架列表
function renderBookList(data) {
  let html = "";
  $.each(data, function(i, el) {
    html += `
      <li class="book_item" data-id="${el.id}">
        <div class="book-grid">
          <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=702693500,4139197472&fm=58" alt="" srcset="">
          <span class="title">${el.title}</span>
        </div>
      </li>
    `
  });
  $(".book_list").append(html)
}

function detailClick(unionid) {
  $(".book_list").on("click", "li", function() {
    var bid = $(this).attr("data-id"), title = $(this).find("span").text()
    httpRequest("/book/record", "get", {bid: bid, unionid: unionid}, function(res) {
      if(res.data) {
        window.location.href = "./content?id=" + res.data.cid + "&bid=" + res.data.bid + "&title=" + title;
      } else {
        httpRequest("/book", "get", {
          id: bid
        }, function (res) {
          let data = res.data
          window.location.href = "./content?id=" + data.first + "&bid=" + bid + "&title=" + title;
        })
      }
    })
  })
}