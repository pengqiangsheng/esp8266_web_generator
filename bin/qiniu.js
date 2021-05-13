const qiniu = require('qiniu')
const fs = require('fs')
const { join } = require('path')
const debug = require('debug')('app:qiniu')
const accessKey = 'CidmCcGziRO7UOENyCqmG-FQ9E3NJfEvW8G_evac'
const secretKey = 'qKP4BfkhPOO1E28cXJXNRh-G48V40LYJEXSfN5VJ'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const urlPrefix = 'mqtt_vue_static_'

const options = {
  scope: 'pengqiangsheng',
  returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

debug(uploadToken)

const config = new qiniu.conf.Config();

const formUploader = new qiniu.form_up.FormUploader(config);

const putExtraJS = new qiniu.form_up.PutExtra({
  mimeType: 'application/javascript'
});
const putExtraCSS = new qiniu.form_up.PutExtra({
  mimeType: 'text/css'
});

const upload = (localFile, key, putExtra) => {
  debug('上传: ', localFile, ' 到七牛云...')
  // 文件上传
  formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
    respBody, respInfo) {
    if (respErr) {
      throw respErr;
    }
    if (respInfo.statusCode == 200) {
      debug(respBody);
    } else {
      debug(respInfo.statusCode);
      debug('已上传到：'+ respBody.bucket + respBody.key);
    }
  });
}

fs.readdirSync(join(__dirname, '../dist/static/js')).reverse().forEach(file => {
  if(file.endsWith('.gz')) return
  let fn = join(__dirname, '../dist/static/js', file)
  upload(fn, urlPrefix + file, putExtraJS)
})

fs.readdirSync(join(__dirname, '../dist/static/css')).reverse().forEach(file => {
  if(file.endsWith('.gz')) return
  let fn = join(__dirname, '../dist/static/css', file)

  upload(fn, urlPrefix + file, putExtraCSS)
})

