var html = document.documentElement || document.body;
var hW = html.getBoundingClientRect().width;
//设置页面最大为100rem  750设计稿
html.style.fontSize = hW / 7.5 + 'px';

var base_url =  'https://pai.zt31.cn/where/total_flow_rate/activity/api'; 

var activityNo,
    platformNo,
    accountUserNo,
    userNo;

    activityNo = "703039765380118179";
    platformNo = "0003";
    accountUserNo = "0008";

// 判断是否有userNo
if($.cookie('userNo') != null) {
  userNo = $.cookie('userNo');
}


// 获取URL参数值
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return decodeURI(r[2]);
  return null; //返回参数值
}
//  阻止手机物理返回JS
$(document).ready(function () {
  if (window.history && window.history.pushState) {
    $(window).on('popstate', function () {
      window.history.pushState('forward', null, '#');
      window.history.forward(1);
    });
  }
  window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
  window.history.forward(1);
});

// 屏蔽掉共享方法
function onBridgeReady() {
  WeixinJSBridge.call('hideOptionMenu');
}

if (typeof WeixinJSBridge == "undefined") {
  if (document.addEventListener) {
    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
  } else if (document.attachEvent) {
    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
  }
} else {
  onBridgeReady();
}

//  判定ios
// var u = navigator.userAgent;
// if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //安卓手机
//   console.log("android")
//   // window.location.href = "mobile/index.html";
// } else if (u.indexOf('iPhone') > -1) { //苹果手机
//   var ratio = window.devicePixelRatio || 1;
//   var screen = {
//     width: window.screen.width * ratio,
//     height: window.screen.height * ratio
//   };
//   var _h = "0.44rem";
//   // var str = '<div class="ios" style="height: 0.44rem;width: 100%;background: rgba(255,255,255,0.6);position: fixed;left: 0;top: 0;"></div>';
//   if (screen.width == 1125 && screen.height === 2436) { // iphoneX
//     //str = '<div class="ios" style="height: 0.72rem;width: 100%;background: rgba(255,255,255,0.6);position: fixed;left: 0;top: 0;"></div>';
//     _h = "0.72rem"        
//   }
//   $('.head_g').css({
//     'height' : _h,
//     "display" : 'block'
//   })

// }


//弹出tip提示框，然后自动消失
function toast(str, callback) {
  
  var tip_wrap = $('<div class="tip_wrap" style="position:fixed; bottom: 56%; width: 100%; text-align: center;"></div>');
  $('body').append(tip_wrap)
  var tip = document.createElement('div');
  tip.innerHTML = str;
  tip.style.cssText = 'padding: 3% 7%; color:#fff; background: rgba(0, 0, 0, 0.701961); text-align: center;border-radius: 5px;transition: all 0.25s;font-size: 0.36rem;width: 56%;margin: 0 auto;line-height: 0.46rem;'
  $('.tip_wrap').append(tip);
  tip.style.opacity = '1';
  var timer1 = setTimeout(function () {
    tip.style.transform = 'translateY(20px)';
    tip.style.webkitTransform = 'translateY(20px)';
    tip.style.opacity = 0;
    var timer2 = setTimeout(function () {
      $('.tip_wrap').remove();
      clearTimeout(timer2)
      callback && callback();
    }, 400)
    clearTimeout(timer1);
  }, 3000);
}