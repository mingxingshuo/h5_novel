$(function () {
  let id = location.search.split("=")[1]
  let unionid = getCookie("user_unionid")
  isInShelf(id, unionid)
  add_shelf(id, unionid)
})

function isInShelf(id, unionid) {
  httpRequest("/user", "get", {
    unionid: unionid
  }, function (res) {
    let inShelf = res.data.shelf.indexOf(id) == -1 ? false : true
    if (inShelf) {
      $(".add_shelf").text("已添加到书架")
    } else {
      $(".add_shelf").text("加入书架")
    }
    getBookDetail(id, unionid)
  })
}

function checkRecord(id, bid, unionid, title) {
  let data = {
    bid: bid,
    unionid: unionid
  }
  httpRequest("/book/record", "get", data, function(res) {
    console.log(res.data)
    if(res.data) {
      $(".read").text("继续阅读").click(function() {
        window.location.href = "./content?id=" + res.data.cid + "&bid=" + bid + "&title=" + title;
    })
    } else {
      $(".read").text("免费阅读").click(function() {
        window.location.href = "./content?id=" + id + "&bid=" + bid + "&title=" + title;
      })
    }
  })
}

function getBookDetail(id, unionid) {
  httpRequest("/book", "get", {
    id: id
  }, function (res) {
    let data = res.data.book
    renderBookDetail(data)
    getChapters(id, data.title)
    checkRecord(res.first, id, unionid, data.title)
  })
}

function renderBookDetail(data) {
  let book_detail = `
      <div class="book-info-container">
        <!-- <img :src="bookDetail.img" alt=""> -->
        <img src="https://ss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=702693500,4139197472&fm=58" alt="" srcset="">
        <div class="book-info">
          <span class="title">${data.title}</span>
          <span class="gray">
              ${data.type == 1 ? "都市" : ""} | ${data.zuozhe}
          </span>
          <span class="gray">
            <span class="${data.xstype == 1 ? "blue" : "red"}">${data.xstype == 1 ? "已完结" : "连载中"}</span>
              | ${data.zishu}
          </span>
        </div>
      </div>
    `;
  $(".desc").text(data.desc)
  $(".book_detail").append(book_detail)
}

function getChapters(id, title) {
  httpRequest("/chapter/all", "get", {
    bid: id
  }, function (res) {
    let data = res.data.slice(0, 10)
    renderChapters(data)
    chapterClick(id, title)
  })
}

function renderChapters(data) {
  let html = "";
  $.each(data, function (i, el) {
    html += `
      <li data-id="${el.id}">
        <p>${el.title}</p>
        <span>${el.isvip == 0 ? "免费" : "付费"}</span>
      </li>
    `
  })
  $(".chapter_list").append(html)
}

function chapterClick(bid, title) {
  $(".chapter_list").on("click", "li", function () {
    let id = $(this).attr("data-id")
    window.location.href = "./content?id=" + id + "&bid=" + bid + "&title=" + title;
  })
}

function add_shelf(id, unionid) {
  $(".add_shelf").click(function () {
    let text = "已添加到书架";
    if ($(".add_shelf").text() == text) {
      httpRequest("/user/unshelf", "get", {
        unionid: unionid,
        id: id
      }, function (res) {
        if (res.success) {
          $(".add_shelf").text("加入书架")
          alert("移出书架")
        } else {
          alert(res.success)
        }
      })
    } else {
      httpRequest("/user/shelf", "get", {
        unionid: unionid,
        id: id
      }, function (res) {
        if (res.success) {
          $(".add_shelf").text(text)
          alert("已添加到书架")
        } else {
          alert(res.success)
        }
      })

    }


  })
}