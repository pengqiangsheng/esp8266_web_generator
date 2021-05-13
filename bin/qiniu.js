const qiniu = require('qiniu')
const accessKey = 'CidmCcGziRO7UOENyCqmG-FQ9E3NJfEvW8G_evac'
const secretKey = 'qKP4BfkhPOO1E28cXJXNRh-G48V40LYJEXSfN5VJ'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

const options = {
  scope: 'pengqiangsheng',
  returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

console.log(uploadToken)
var config = new qiniu.conf.Config();

var localFile = "./bin/test.md";
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var key='test.txt';
// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    console.log(respBody);
  } else {
    console.log(respInfo.statusCode);
    console.log(respBody);
  }
});