
function httpRequest(url, method, data, cb) {
  $.ajax({
    url: url,
    type: method,
    data: data,
    success: cb
  })
}