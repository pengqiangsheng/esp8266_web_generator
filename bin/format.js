const fs = require('fs')
const debug = require('debug')('app:format')
const { join } = require('path')
debug('格式化html开始.')

// const command = [...process.argv].pop()

// debug('尝试读取命令行参数...')

// if(command.includes('http://') || command.includes('https://')) debug('命令行参数读取成功:', command)
// else debug('命令行参数无法读取，将使用默认参数')

const { domain, perfix } = JSON.parse(fs.readFileSync('./config.json'))

debug('准备打开源文件...')

fs.readFile('./dist/index.html', function (error, data) {
  if (error) {
    debug('文件打开错误...')
  } else {
    debug('源文件已打开正在转换格式...')
    const buf = data.toString()
      .replace(/static\/js\//g, domain + perfix)
      .replace(/static\/css\//g, domain + perfix)
      .replace(/\"/g, '\'')
    debug('源文件转化完毕，正在写入...')

    const fileName = './output/index-' + randomString(8) + '.html'
    
    deleteAll('./output')
    fs.mkdirSync('./output')
 
    fs.writeFile(fileName, buf, function (error) {
      if (error) {
        debug('写入失败...')
      } else {
        debug('写入成功，文件生成在: ', fileName)
      }
    })

    const fileNameC = `./output/webServer-${randomString(8)}.ino`
    const inoBuf = fs.readFileSync('./bin/source')
    const buf2 = inoBuf.toString()
      .replace('replace_pos', buf)
      .replace(/\'\+e\+\'/g, '')
      .replace(/\\n/g, '')
      .replace(/\'\+n\+\'/g, '')
      .replace(/\'\+o\+\'/g, '')
      .replace(/\(: \)/g, '')

    fs.writeFile(fileNameC, buf2 , function (error) {
      if (error) {
        debug('写入失败...')
      } else {
        debug('写入成功，文件生成在: ', fileNameC)
      }
    })
  }
})

function deleteAll(path) {
  var files = [];
  if(fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteAll(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

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