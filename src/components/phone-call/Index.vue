<template>
  <van-popup v-model="show" position="bottom" :overlay="true">
    <div class="phone-wrapper">
      <div class="item-wrapper"><a :href="'tel:' + phone" >{{ phone }}</a></div>
      <div class="item-wrapper" @click="call">呼叫</div>
      <!-- clipboard的关键，需要data-clipboard-text属性 -->
      <div class="item-wrapper clip-phone" :data-clipboard-text="phone">复制</div>
      <div class="item-wrapper" @click="close">取消</div>
    </div>
  </van-popup>
</template>
<script>
import Clipboard from 'clipboard'
export default {
  props: {
    phone: {
      type: String || Number,
      required: true
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.show = val
        this.$emit('input', val)
      }
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  data() {
    return {
      clipboard: null,
      show: false
    }
  },
  mounted() {
    this.clipboard = new Clipboard('.clip-phone')
    this.clipboard.on('success',  () => {
      this.$toast.success("复制成功")
      this.close()
    })
    this.clipboard.on('error',  () => {
      this.$toast.fail("复制失败")
    })
  },
  destroyed() {
    this.clipboard.destroy()
  },
  methods: {
    call() {
      window.location.href = 'tel://' + this.phone;
    },
    close() {
      this.show = false
    }
  }
}
</script>
<style lang="less">
@basePath: "../../assets/styles";
@import "@{basePath}/variable.less";
@import "@{basePath}/mixin.less";
.phone-wrapper {
  width: 100%;
  .px2rem(font-size, @font-size-medium-x);
  background-image: linear-gradient(to right, #E1DBDB , #ffffff);
  .item-wrapper {
    padding: 10px 20px;
    background-color: @border;
    border-top: 1px solid #F2EEED;
    background-image: linear-gradient(to right, #F3EFEF , #ffffff);
    &:last-child {
      margin-top: 8px;
    }
  }
}
</style>