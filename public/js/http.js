
function httpRequest(url, method, data, cb) {
  // let uid = JavaScriptInterface.getUid(),
  //     deviceid = JavaScriptInterface.getDeviceid();
  $.ajax({
    url: url,
    type: method,
    // headers: {
    //   uid: uid,
    //   deviceid: deviceid
    // },
    data: data,
    success: cb
  })
}