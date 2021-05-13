/* eslint-disable*/
import Vue from 'vue'
import uploadComponent from './component.vue'
import { createEl } from '@/utils/tools'

const uploadBasic = Vue.extend(uploadComponent)
let uploadVm = null
let uploadEl = null
function useUpload(start, callback, scale) {
  if(!uploadVm) {
    uploadVm = new uploadBasic()
    uploadEl = createEl('div')
    uploadVm.$mount(uploadEl)

    // 设置缩放比例
    uploadVm.scale = scale || 1

    uploadVm.$on('start', () => {
      console.log('start', typeof start=== 'function')
      if(typeof start === 'function') start('start')
    })

    uploadVm.$on('finish', data => {

      uploadVm.$nextTick(() => {
        uploadVm.$destroy()
        uploadVm = null
        uploadEl = null
      })
      
      if(callback) callback(data)
    })

    // 触发上传操作
    uploadVm.upload()
  }else {
    uploadVm.upload()
  }
}

export default {
  install: function (Vue, options) {
    Vue.prototype.$useUpload = function () {
      useUpload(...([].splice.call(arguments, 0)))
    }
  }
}


