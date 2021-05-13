import Vue from 'vue'
import ToastComp from '@/components/toast'
import { createEl, addEl, removeEl, findEl } from '@/utils/tools'

const loadingBasic = Vue.extend(ToastComp)
const LOADINGV1 = '.loading-v1'

const root = () => {
  const div = createEl('div')
  addEl(div)
  return div
}

const opt = {
  duration: 2000,
  message: '加载中',
  type: 'loading' // warn
}

function useLoading() {
  let loadingVm
  let timer
  return function() {
    const options = Object.assign({}, opt, arguments[0])
    const { duration, message, type } = options
    let loadingEl

    if(!loadingVm) {
      loadingVm = new loadingBasic()
      loadingEl = root()
      loadingVm.$mount(loadingEl)
    }
    if(!timer) {
      console.log(options)
      // 显示loading和内容
      loadingVm.dmessage = message
      loadingVm.dshow = 'show'
      loadingVm.dtype = type
      duration && (timer = setTimeout(() => {
        clearTimeout(timer)
        timer = null
        close()
      }, duration))
    }else {
      console.log('有timer')
    }

    const close = () => {
      loadingVm.dshow = 'close'
      timer && clearTimeout(timer)
      timer = null
    }

    const destroy = () => {
      loadingVm.$nextTick(() => {
        loadingVm.$destroy()
        removeEl(findEl(LOADINGV1))
        loadingEl = null
        loadingVm = null
      })
    }

    return {
      vnode: loadingVm,
      close: close,
      destroy: destroy
    }
  }
}

export default {
  // eslint-disable-next-line
  install: function(Vue, options) {
    Vue.prototype.$loadingV1 = useLoading()
  }
}
