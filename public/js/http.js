
function httpRequest(url, method, data, cb) {
  $.ajax({
    // url: "http://localhost:3001" + url,
    url: url,
    type: method,
    data: data,
    success: cb
  })
}