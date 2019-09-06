(function () {
  $(function () {
    var flag = true; // 标志用来鉴别是否填表
    var tel, captcha; // 声明电话以及验证码变量
    // var isLoading = false; // 验证码点击标志防止多次请求getcaptcha
    var tel_reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    // var userInfo = {};


    var getCode = false;


    
    // setTimeout(function() {
    //   mask.hide();
    // },2000)
    $.ajax({
      type: "POST",
      url: base_url + "/getActivityInfo",
      async:false,
      data: {
        "activityNo": activityNo,
        "platformNo": platformNo,
        "accountUserNo": accountUserNo,
        'userNo': userNo
      },
      dataType: "json",
      success: function (data) {
        console.log(data);
        if (data.code == "0000" ) {
          // 存储userNo
          if (!$.cookie('userNo')) {
            userNo = data.data.userNo;
            $.cookie('userNo', userNo);
          }
          // 判断图形还是短信验证码
          if (data.data.verifyCodeType == "0") {
            // 图形
            $('.get_captch').remove();
            $('.captcha_img').attr('src', base_url + '/verCodeImg?activityNo=' + activityNo + '&userNo=' + userNo + '&d=' + Math.random()).show();
          } else {
            // 短信
            $('.get_captch').show();
            $('.captcha_img').remove();
          }
          $('.pay_body').css({
            'visibility': "inherit"
          });
          
        } else if (data.code == "0003") {
          $(".pay_body").empty().append('<img src="./images/4.png" class="end_img" alt="活动尚未开始">').css('visibility', "inherit");
          
        } else if (data.code == "0004") {
          // window.location.href = "states.html?code=4";
          $(".pay_body").empty().append('<img src="./images/5.png" class="end_img" alt="活动已结束">').css('visibility', "inherit");
        } else if (data.code == "0005" && flag) {
          // $(".pay_body").empty().append('<img src="./images/joined.png" class="acted_img" alt="">').css('visibility', "inherit");
          window.location.href = "active.html?code=0005";
        } else if (data.code == "9999") {
          var error_cue = '<div class="error_cue"><p>系统异常,<br/>请稍后再试!</p></div>';
          $('.body').append(error_cue);
          $('.error_cue').fadeIn();
        } else if (data.code == "7000") {
          window.location.href = data.data;
        } else {
          window.location.href = "index.html";
        }      
        // $('.body .captcha_img').attr('src', base_url + '/verCodeImg?activityNo=' + activityNo + '&userNo=' + userNo + '&d=' + Math.random())
        $('.meng').hide();
      }
      
    });


    // 获取图形验证码
    $('.captcha_img').click(function () {
      $('.captcha_img').attr('src', base_url + '/verCodeImg?activityNo=' + activityNo + '&userNo=' + userNo + '&d=' + Math.random());
    })

    // 获取验证码点击事件
    $('.get_captch').click(function () {
      // alert();
      getCode = true;
      // 判断是否点击获取验证码！
      tel = $.trim($("input[name='phone']").val());
      if (!tel_reg.test(tel) && flag) {
        toast("请正确输入手机号", function () {
          flag = true;
        });
        flag = false;
      }
      if (flag) {
        clearInterval(timer);
        $(this).attr('disabled', true); // 禁用按钮
        $(this).addClass('disable_btn');
        var _t = 60;
        $(".get_captch").val('重新发送( ' + _t + 's )');
        var timer = setInterval(function () {
          _t--;
          $(".get_captch").val('重新发送( ' + _t + 's )');
          if (_t == 0) {
            clearInterval(timer);
            $(".get_captch").removeClass("disable_btn").val('获取验证码').attr("disabled",false);
          };
        }, 1000);
        $.ajax({
          type: "POST",
          url: base_url + "/sendValidateCode",
          data: {
            "activityNo": activityNo,
            "platformNo": platformNo,
            "accountUserNo": accountUserNo,
            "mobile": tel, // tel
            "userNo": userNo
          },
          dataType: "json",
          success: function (data) {
            if (data.code != "0000" && flag) {
              clearInterval(timer);
              if (data.code == "0012" && flag) {
                toast("该活动仅限掌银<br/>新用户参加", function () {
                  flag = true;
                });
                flag = false;
              } else {
                toast(data.info, function () {
                  flag = true;
                });
                flag = false;
              }
              $(".get_captch").removeClass("disable_btn").val('获取验证码').attr("disabled",false);
            }
          }
        })
      }
    })

    // 支付一分钱点击事件
    $('.pay_btn').click(function () {
      tel = $.trim($("input[name='phone']").val());
      captcha = $.trim($("input[name='captch_num']").val());
      if (!tel_reg.test(tel) && flag) {
        toast("请正确输入手机号", function () {
          flag = true
        });
        flag = false
      }
      if ((captcha == "") && flag) {
        toast("请填写验证码！", function () {
          flag = true
        });
        flag = false;
      }
      if (getCode && flag) {
        $.ajax({
          type: "POST",
          url: base_url + "/goPay",
          Content: "application/json;charset=UTF-8",
          data: {
            "activityNo": activityNo,
            "platformNo": platformNo,
            "accountUserNo": accountUserNo,
            "mobile": tel, // tel
            "verCode": captcha, // captcha
            "userNo": userNo
          },
  
          dataType: "json",
          success: function (data) {
            console.log(data);
            if (data.code == "0000") {
              if (data.data.result != "0000" && flag) { // 请求成功内部失败
                if(data.data.result == '0007') {
                  toast('验证码错误', function () {
                    flag = true
                  });
                  flag = false;
                } else {
                  toast(data.data.resultMessage, function () {
                    flag = true
                  });
                  flag = false;
                }
                $('.pay_btn').attr('disabled', false)
              } else { // 请求成功
                window.location.href = "active.html?orderNo=" + data.data.orderNo + '&v=' + Math.random(); // 完成
              }
            } else if (data.code == "0008") { // 支付尚未领奖
              sessionStorage.setItem('orderNo', data.data.orderNo);
              window.location.href = "active.html?orderNo=" + data.data.orderNo + '&v=' + Math.random();
            } else if (data.code == "0005") {
              window.location.href = "active.html?code=0005";
            } else if (data.code == "0013" && flag) {
              // 奖品发放完
              $(".pay_body").empty().append('<img src="./images/7.png" class="acted_img" alt="奖品以发放完">').css('visibility', "inherit");
              $('.meng').hide();
            }else {
              toast(data.info, function () {
                flag = true
              });
              flag = false;
              $('.pay_btn').attr('disabled', false)
            }
          }
        })

      } else {
        if (flag) {
          toast('请获取验证码', function () {
            flag = true
          });
          flag = false;
        }
      }
    })

  })
})();