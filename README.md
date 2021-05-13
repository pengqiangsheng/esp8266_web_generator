# MQTT Web Client

> mqtt web 客户端

# 使用方法

- dev 运行开发
- build 打包
- build:stage 预发布打包，有vconsole
- view 预发布打包并在本地启动一个web服务器
- http 进入打包目录并启动web服务器
- format 格式化html文件
- qiniu 用七牛云对dist里面的静态文件进行上传

# 配置文件

打开根目录下的 `config.json` 文件，对如下信息进行修改

- "perfix": "mqtt.vue.static.", // 文件前缀
- "domain": "http://img.pqs.guozhaoxi.top/", // 七牛云空间域名
- "accessKey": "******", // 七牛云Ak
- "secretKey": "******", // 七牛云Sk
- "bucket": "*******" // 七牛云对象存储空间名

# 版本

遵循MIT协议