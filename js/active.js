(function () {
  $(window).load(function () {


    var orderNo = getUrlParam('orderNo') ? getUrlParam('orderNo') : sessionStorage.getItem('orderNo');
    sessionStorage.setItem('orderNo', orderNo);

    var code = getUrlParam('code');
    var winningNo = '';

    if (!code) {
      if(orderNo) {
        $.ajax({
          type: "POST",
          url: base_url + "/getGift",
          async: false,
          data: {
            "activityNo": activityNo,
            "platformNo": platformNo,
            "accountUserNo": accountUserNo,
            "userNo": userNo,
            "orderNo": orderNo
          },
          dataType: "json",
          success: function (data) {
            console.log("getGift", data);
            if (data.code == "0000") {
              winningNo = data.data.winningNo;
            } else {
              window.location.href = "index.html";
            }
            $('.meng').hide();
          }
        });
        $('.mask').eraser({
          size: 40, //设置橡皮擦大小
          completeRatio: 0.5,
          callback: AJAX
        });
  
        var isL = false;
        function AJAX() {
          if (isL) {
            return false;
          }
          isL = true;
          $.ajax({
            type: "POST",
            url: base_url + "/charge",
            data: {
              "activityNo": activityNo,
              "platformNo": platformNo,
              "accountUserNo": accountUserNo,
              "userNo": userNo,
              "orderNo": orderNo,
              "winningNo": winningNo
            },
            dataType: "json",
            success: function (data) {
  
              console.log("charge", data);
              if (data.code == "0000") {
                sessionStorage.clear();
              } else {
                window.location.href = "index.html";
              }
  
            }
          }); // charge --end
        }
      } else {

        window.location.href = 'index.html';
      }

    } else {
      $('.mask').fadeOut(100);
      $('.meng').hide();
    }
  })
})()