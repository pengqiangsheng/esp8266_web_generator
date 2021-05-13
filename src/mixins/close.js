export default {
  data: () => ({
    second: 5
  }),
  methods: {
    closeWebView() {
      console.log('closeWebView')
      this.second = 5
      let timer = setInterval(() => {
        this.second--
        console.log('closeWebView:', this.second)
        if(!this.second) {
          window.WeixinJSBridge && window.WeixinJSBridge.call('closeWindow')
          window.AlipayJSBridge && window.AlipayJSBridge.call('closeWebview')
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    },
    closeBrowser() {
      console.log('closeBrowser')
      this.second = 2
      let timer = setInterval(() => {
        this.second--
        console.log('closeBrowser:', this.second)
        if(!this.second) {
          window.WeixinJSBridge && window.WeixinJSBridge.call('closeWindow')
          window.AlipayJSBridge && window.AlipayJSBridge.call('closeWebview')
          clearInterval(timer)
          timer = null
        }
      }, 1000)
    }
  },
}