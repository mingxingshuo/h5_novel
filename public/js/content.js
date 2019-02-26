$(function () {
  let id = location.search.split("=")[1].split("&")[0]
  let bid = location.search.split("=")[2].split("&")[0]
  let title = location.search.split("=")[3]
  let unionid = getCookie("user_unionid")
  getContent(id, unionid)
  getBgColor()
  changeBgColor()
  toChapters(bid, title)
  changeChapter(id, title)
  getFontSize()
  changeFontSize()
  getChapterPos(id, bid)
})

// 获取cookie字体大小
function getFontSize() {
  let fontSize = getCookie("fontSize");
  if(fontSize) {
    $("body .chapter-content").css({"font-size": fontSize})
  } else {
    $("body .chapter-content").css({"font-size": ".36rem"})
    setCookie("fontSize", fontSize)
  }
}

// 获取cookie字体大小
function getBgColor() {
  let bgColor = getCookie("bgColor");
  if(bgColor) {
    $("body").css({background: bgColor})
    isBlack(bgColor)
  } else {
    $("body").css({background: "eee"})
    setCookie("bgColor", "eee")
  }
}

// 判断是否首末章节
function getChapterPos(id, bid) {
  httpRequest("/book", "get", {
    id: bid
  }, function (res) {
    let data = res.data
    if(data.first == id) {
      $(".prev_chapter").css({"display": "none"})
    } else {
      $(".prev_chapter").css({"display": "block"})
    }
    if(data.last == id) {
      $(".next_chapter").css({"display": "none"})
    } else {
      $(".next_chapter").css({"display": "block"})
    }
  })
}

// 获取章节内容
function getContent(id, unionid) {
  let url = "/chapter"; 
  let data = {
    id: id,
    unionid: unionid
  }
  httpRequest(url, "get", data, function(res) {
    renderContent(res.data)
  })
}

// 渲染章节内容
function renderContent(data) {
  $(".chapter-name").text(data.title)
  $(".chapter-content").html(data.content)
}

// 跳转目录
function toChapters(bid, title) {
  $(".to-chapters").click(function() {
    window.location.href = "./chapters?bid=" + bid + "&title=" + title;
  })
}

// 切换章节
function changeChapter(id, title) {
  let unionid = getCookie("user_unionid")
  $(".prev_chapter").click(function() {
    let data = {
      id: (Number(id) - 1),
      unionid: unionid
    }
    httpRequest("/chapter", "get", data, function(res) {
      let data = res.data
      if(res.success == "成功") { 
        window.location.href = "./content?id=" + data.id + "&bid=" + data.bid + "&title=" + title
      } else {
        alert("书币不足，请充值")
      }
    })
  })
  $(".next_chapter").click(function() {
    let data = {
      id: (Number(id) + 1),
      unionid: unionid
    }
    httpRequest("/chapter", "get", data, function(res) {
      let data = res.data
      if(res.success == "成功") {
        window.location.href = "./content?id=" + data.id + "&bid=" + data.bid + "&title=" + title
      } else {
        alert("书币不足，请充值")
      }
    })
  })
}

// 修改背景颜色
function changeBgColor() {
  $(".color-setting").on("click", "li", function () {
    let bgColor = $(this).attr("data-color")
    $("body").css({background: bgColor})
    setCookie("bgColor", bgColor)
    isBlack(bgColor)
  })
}


// 是否是黑夜背景
function isBlack(bgColor) {
  if(bgColor == "#2c3e50") {
    $(".chapter-content, .font-setting, .btn-wrapper").css({color: "#f9f9f9"})
  } else {
    $(".chapter-content, .font-setting, .btn-wrapper").css({color: "#000"})
  }
}

// 修改字体大小
function changeFontSize() {
  let fontSize = getCookie("fontSize");
  let fontNum = Number(fontSize.split("rem")[0])
  $(".font-add").click(function() {
    if(fontNum <= 0.4) {
      fontNum += 0.02
      $("body .chapter-content").css({"font-size": fontNum + "rem"})
      setCookie("fontSize", fontNum + "rem")
    }
  })
  $(".font-reduce").click(function() {
    if(fontNum > 0.29) {
      fontNum -= 0.02
      $("body .chapter-content").css({"font-size": fontNum + "rem"})
      setCookie("fontSize", fontNum + "rem")
    }
  })
}


