<script>
import { dataURLtoFile, getImageTag } from '@/utils/tools'
import UploadAdapter from '@/utils/uploadAdapter'
export default {
  name: 'UploadBasic',
  data() {
    return {
      scale: 1,
      limitSize: 400 * 1024
    }
  },
  methods: {
    upload() {
      this.$refs.upBInput.click()
    },
    // 使用图片处理类
    async changeFile(e) {
      const [file] = e.target.files
      const adapter = new UploadAdapter()
      this.$emit('start')
      const data = await adapter.getStream(file)
      console.log(data)
      this.$emit('finish', {
        base64: data
      })
    },
    async _changeFile(e) {
      // 使用FileReader读取文件流，file为上传的文件流
      const file = e.target.files[0]
      const reader = new FileReader()
      const self = this
      const or = await getImageTag(file, 'Orientation')
      this.$emit('start')

      reader.onloadend = function() {
        const result = this.result
        const img = new Image()
        img.src = result
        img.onload = function() {
          // 旋转图片
          const canvas = self._getRotateImg(img, or)
          // 压缩后的文件 image/jpeg image/png base64格式
          const data = canvas.toDataURL('image/png')
          // 文件流格式
          const f = dataURLtoFile(data)

          self.$emit('finish', {
            base64: data,
            newFile: f,
            orignFile: file
          })
        }
      }

      reader.readAsDataURL(file)
    },
    // 获取旋转后的图片
    _getRotateImg(img, or) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      // 图片原始大小
      const width = img.width
      const height = img.height

      // 缩放大小
      const r = width / height

      const sW = 400
      const sH = (400 / r).toFixed(0)
      // const sW = width * this.scale;
      // const sH = height * this.scale;

      canvas.width = sW
      canvas.height = sH
      ctx.drawImage(img, 0, 0, sW, sH)

      // this.tip = or
      switch (or) {
        case 6: // 顺时针旋转90度
          this._rotateImg(img, 'right', canvas)
          break
        case 8: // 逆时针旋转90度
          this._rotateImg(img, 'left', canvas)
          break
        case 3: // 顺时针旋转180度
          this._rotateImg(img, 'right', canvas, 2)
          break
        default:
          break
      }
      return canvas
    },
    // 旋转canvas
    _rotateImg(img, dir = 'right', canvas, s = 1) {
      const MIN_STEP = 0
      const MAX_STEP = 3

      const width = canvas.width || img.width
      const height = canvas.height || img.height
      let step = 0

      if (dir === 'right') {
        step += s
        step > MAX_STEP && (step = MIN_STEP)
      } else {
        step -= s
        step < MIN_STEP && (step = MAX_STEP)
      }

      const degree = (step * 90 * Math.PI) / 180
      const ctx = canvas.getContext('2d')

      switch (step) {
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height, width, height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height, width, height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0, width, height)
          break
        default:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)
          break
      }
    }
  },
  render() {
    return (
      <input
        ref="upBInput"
        type="file"
        accept="image/*"
        style="display:none;"
        onChange={e => {
          this._changeFile(e)
        }}
      />
    )
  }
}
</script>
