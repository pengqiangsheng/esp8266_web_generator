# MQTT Web Client

> mqtt web 客户端

# 使用方法

- dev 运行开发
- build 打包
- build:stage 预发布打包，有vconsole
- view 预发布打包并在本地启动一个web服务器
- http 进入打包目录并启动web服务器
- qiniu 用七牛云对dist里面的静态文件进行上传
- format 格式化html的内容并输出到`output`目录下
- bqf 将`build:stage` `qiniu` `format` 按顺序进行

# 第一次使用请看！！！！

在根目录下将 `config.json.back` 文件改名成 `config.json`，并填入以下信息：

```json
{
  "perfix": "", // 文件前缀
  "domain": "", // 七牛云空间域名
  "accessKey": "", // 七牛云Ak
  "secretKey": "", // 七牛云Sk
  "bucket": "" // 七牛云对象存储空间名
}
```

# 版本

遵循MIT协议