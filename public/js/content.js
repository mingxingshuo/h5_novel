$(function () {
  let id = location.search.split("=")[2].split("&")[0] || '<%= id %>'
  let bid = location.search.split("=")[1].split("&")[0]
  document.onreadystatechange = function () {
    if(document.readyState === "complete") {
      $(".loading").remove();
    }
  };
  getBgColor()
  changeBgColor()
  changeChapter(bid, id)
  getFontSize()
  changeFontSize()
})

// 获取cookie字体大小
function getFontSize() {
  let fontSize = getCookie("fontSize");
  if(fontSize) {
    $("body .chapter-content").css({"font-size": fontSize})
  } else {
    $("body .chapter-content").css({"font-size": ".36rem"})
    setCookie("fontSize", ".36rem")
  }
}

// 获取cookie背景颜色
function getBgColor() {
  let bgColor = getCookie("bgColor");
  if(bgColor) {
    $(".detail").css("background-color",bgColor)
    console.log($(".detail").attr("background-color"))
    isBlack(bgColor)
  } else {
    $(".detail").css("background-color",bgColor)
    setCookie("bgColor", "#eee")
  }
}

// 切换章节
function changeChapter(bid, id) {
  $(".prev_chapter").on("click", function() {
    window.location.href = "/content?bid=" + bid + "&id=" + (Number(id) - 1)
  });
  $(".next_chapter").on("click", function() {
    window.location.href = "/content?bid=" + bid + "&id=" + (Number(id) + 1)
  });
}

// 修改背景颜色
function changeBgColor() {
  $(".color-setting").on("click", "li", function () {
    let bgColor = $(this).attr("data-color")
    $(".detail").css("background-color",bgColor)
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
  $(".font-add").on("click", function() {
    if(fontNum <= 0.4) {
      fontNum += 0.02
      $("body .chapter-content").css({"font-size": fontNum + "rem"})
      setCookie("fontSize", fontNum + "rem")
    }
  })
  $(".font-reduce").on("click", function() {
    if(fontNum > 0.29) {
      fontNum -= 0.02
      $("body .chapter-content").css({"font-size": fontNum + "rem"})
      setCookie("fontSize", fontNum + "rem")
    }
  })
}


