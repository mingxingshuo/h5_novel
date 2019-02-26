$(function () {
  let id = location.search.split("=")[1].split("&")[0]
  let title = decodeURI(location.search.split("=")[2])
  getChapters(id, title)
})

function getChapters(id, title) {
  httpRequest("/chapter/all", "get", {bid: id}, function(res) {
      let data = res.data
      renderChapters(data, title)
      chapterClick(id, title)
  })
}

function renderChapters(data, title) {
  $(".chapter-title").text(title)
  let html = "";
  $.each(data, function (i, el) {
    html += `
      <li data-id="${el.id}" data-vip="${el.isvip}">
        <p>${el.title}</p>
        <span>${el.isvip == 0 ? "免费" : "付费"}</span>
      </li>
    `
  })
  $(".chapter_list").append(html)
}

function chapterClick(bid, title) {
  $(".chapter_list").on("click", "li", function () {
    let id = $(this).attr("data-id"),
      vip = $(this).attr("data-vip")
    if (vip == 0) {
      window.location.href = "./content?id=" + id + "&bid=" + bid + "&title=" + title;
    } else {
      let unionid = getCookie("user_unionid")
      httpRequest("/chapter", "get", {id: id, unionid: unionid}, function(res) {
          if(res.success == "成功") {
            window.location.href = "./content?id=" + id + "&bid=" + bid + "&title=" + title;
          }else {
            alert(res.err)
          }
      })
    }
  })
}