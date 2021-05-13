<script>
import ProgressCircle from '@/components/progress-circle'
export default {
  name: 'ToastInSelf',
  components: {
    ProgressCircle
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dmessage: '',
    dtype: '',
    dshow: '',
    offset: 78.5
  }),
  computed: {
    getType() {
      return this.type ? this.type : this.dtype
    },
    getMessage() {
      return this.message ? this.message : this.dmessage
    },
    getShow() {
      console.log(this.dshow)
      if(this.dshow) {
        return this.dshow === 'show'
      }else {
        return this.show
      }
    }
  },
  render() {
    const renderIcon = () => {
      return this.getType === 'warn' ? (
        <span class="warn-wrapper">
          <van-icon name="fail" />
        </span>
      ) : (
        <progress-circle offset={this.offset}/>
      )
    }

    const renderWarpper = () => {
      // return this.getShow ? (
      //   <div class={...className} >
      //     {this.$slots.default ? this.$slots.default : renderIcon()}
      //     <div class="tip-wrapper">{this.getMessage}</div>
      //   </div>
      // ) : null
      return (
         <div class={this.getShow ? 'toast-wrapper loading-v1 play' : 'toast-wrapper loading-v1'} >
          {this.$slots.default ? this.$slots.default : renderIcon()}
          <div class="tip-wrapper">{this.getMessage}</div>
        </div>
      )
    }
    return renderWarpper()
  }
}
</script>

<style lang="less" scoped>
.toast-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 184px;
  text-align: center;
  margin-top: -72px;
  margin-left: -92px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.86);
  z-index: 2001;
  display: none;
  &.play {
    display: block;
  }
  .tip-wrapper {
    font-size: 14px;
    margin-top: 10px;
    color: #ffffff;
  }
  .warn-wrapper {
    position: relative;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: #ffffff;
    display: inline-block;
    text-align: center;
    i {
      vertical-align: top;
    }
    // &::before {
    //   position: absolute;
    //   width: 3.5px;
    //   height: 20px;
    //   top: 8px;
    //   left: 20px;
    //   background-color: rgba(0, 0, 0, 0.86);
    //   content: '';
    // }
    // &::after {
    //   position: absolute;
    //   width: 3.5px;
    //   height: 4px;
    //   top: 30px;
    //   left: 20px;
    //   background-color: rgba(0, 0, 0, 0.86);
    //   content: '';
    // }
  }
}
</style>
