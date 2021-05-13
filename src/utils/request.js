import axios from 'axios'
import { Notify } from 'vant';
const protocol = document.location.protocol
const port = protocol === 'https:' ? '8443' : '8088'
// `${protocol}//test6-iot.leelen.com:${port}/rest/cb/web/`
// 创建 axios 实例
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/rest/cb/web/'
      : `${protocol}//test6-iot.leelen.com:${port}/rest/cb/web/`, // api 的 base_url
  timeout: 5000 // request timeout
})


// 请求拦截器
service.interceptors.request.use(
  config => {
    // const header = {
    // }
    // const cData = config.data
    // const isObj = cData instanceof Object
    // if (isObj && !(cData instanceof Array)) {
    //   config.data = {
    //     header: header,
    //     body: {
    //       ...cData
    //     }
    //   }
    // } else {
    //   config.data = {
    //     header: header,
    //     body: cData
    //   }
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log('请求拦截request.js报错', error) // for debug
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // loadingInstance.close()
    return response
  },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    // loadingInstance.close()
    console.log('服务器错误' + error) // for debug
    Notify(error.message)
    return Promise.reject(error)
  }
)

export default service
