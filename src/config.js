const u = navigator.userAgent;
const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
const isWeixin = u.toLowerCase().indexOf('micromessenger') != -1; //微信浏览器

let phoneType = ''
const phoneWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth

if (phoneWidth > 400) { 
  phoneType = "iphone6 plus"
} else if (phoneWidth > 370) { 
  phoneType = "iphone6"
} else if (phoneWidth > 315) { 
  phoneType = "iphone5 or iphone5s"
} else { 
  phoneType = "iphone 4s"
}

const tip = (cb) => {
  if (isIOS
      && (phoneType.indexOf('4') > -1
          || phoneType.indexOf('5') > -1
         )
  ) {
    cb('抱歉由于您的手机设备屏幕尺寸太小，浏览效果可能会变得很差')
  }
}

export {
  isIOS,
  isWeixin,
  isAndroid,
  phoneType,
  phoneWidth,
  tip
}