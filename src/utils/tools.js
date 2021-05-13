import Exif from 'exif-js'

/**
 * 获取图片自身的角度信息
 * @param {File} file 文件
 * @param {String} tag 标签
 * @return {Number} or 角度信息
 * or信息：   6  1  3  8
 * 对应角度：-90 0 180 90
 */
const getImageTag = (file, tag) => {
  if (!file) return 0
  return new Promise((resolve) => {
    /* eslint-disable func-names */
    // 箭头函数会修改this，所以这里不能用箭头函数
    Exif.getData(file, function () {
      const o = Exif.getTag(this, tag)
      resolve(o)
    })
  })
}

/**
 * @desc 将base64的图片转为文件流
 * @param {String} dataUrl base64数据
 * @return {Object} 文件流
 */
const dataURLtoFile = (dataUrl) => {
  const filename = `img-${Date.now()}`
  const arr = dataUrl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

// 下载文件流，要设置请求头{responseType: 'blob'}属性
function downFile(res, fileName = null) {
  if (fileName === null) {
    fileName = decodeURI(res.headers['content-disposition'].split('=')[1])
  }
  const type = res.headers['content-type']
  const blob = new Blob([res.data], { type })
  var oa = document.createElement('a')
  var href = URL.createObjectURL(blob)
  oa.href = href
  oa.download = fileName
  document.body.appendChild(oa)
  oa.click()
  document.body.removeChild(oa)
  window.URL.revokeObjectURL(href)
}

// 下载图片(触发a事件)
const downImg = (stream, name) => {
  let a = document.createElement("a");
  let event = new MouseEvent("click");
  a.download = name || "photo.png";
  a.href = stream;
  a.dispatchEvent(event);
  a = null;
}
// 从canvas下载图片
const fromCanvasDownload = name => {
  const canvas = document.querySelector('canvas');
  const url = canvas.toDataURL('image/jpg');
  downImg(url, name)
}
// 从一个链接下载图片
const fromUrlDownload = (imgUrl, name) => {
  const image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.src = imgUrl;
  image.onload = function() {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    downImg(url, name)
  };
}

const setTitle = title => document.title = title
const createEl = label => document.createElement(label)
const addEl = (el, target = document.body) => target.appendChild(el)
const removeEl = (el, target = document.body) => target.removeChild(el)
const findEl = css => document.querySelector(css)

// DOM 操作有关
export {
  setTitle,
  createEl,
  addEl,
  removeEl,
  findEl
}

// 下载相关
export {
  fromCanvasDownload,
  fromUrlDownload,
  downFile,
  downImg
}


// 图片处理相关
export {
  getImageTag,
  dataURLtoFile
}