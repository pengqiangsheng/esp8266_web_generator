const fs = require('fs')

console.log('格式化html开始.')

const command = [...process.argv].pop()

console.log('尝试读取命令行参数...')

if(command.includes('http://') || command.includes('https://')) console.log('命令行参数读取成功:', command)
else console.log('命令行参数无法读取，将使用默认参数')

const urlPrefix = command || 'http://img.pqs.guozhaoxi.top/mqtt-vue-'

console.log('准备打开源文件...')

fs.readFile('./dist/index.html', function (error, data) {
  if (error) {
    console.log('文件打开错误...')
  } else {
    console.log('源文件已打开正在转换格式...')
    const buf = data.toString()
      .replace(/static\/js\//g, urlPrefix)
      .replace(/static\/css\//g, urlPrefix)
      .replace(/\"/g, '\'')
    console.log('源文件转化完毕，正在写入...')
    const fileName = './dist/index-' + randomString(8) + '.html'
    fs.writeFile(fileName, buf, function (error) {
      if (error) {
        console.log('写入失败...')
      } else {
        console.log('写入成功，文件生成在: ', fileName)
      }
    })
  }
})

function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}