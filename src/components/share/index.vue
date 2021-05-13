<template>
	<div class="share">
		<div class="bg-bottom-wrapper"></div>
		<div class="bg-wrapper">
			<img src="../../assets/img/bg5.png">
			<div class="qrcode-text-wrapper text-top">
				<p>尊敬的 {{ name }} 先生/女士：</p>
			</div>
			<div class="qrcode-wrapper" ref="qrcodeWrapper">
				<!-- <img :src="imgUrl"> -->
        <!-- <div id="qrcode" ref="qrcode"></div> -->
        <div v-qr="qrCodeObj" v-if="qrCodeRender" />
			</div>
			<div class="qrcode-text-wrapper text-bottom">
				<p>请对门禁设备刷二维码进出</p>
				<p>到访时间：{{ date }}</p>
			</div>
		</div>
		<div class="tip-wrapper">
			<span>点击右上角-选择发送给朋友</span>
		</div>
	</div>
</template>
<script>
import moment from 'moment'
import { Base64 } from 'js-base64'

export default {
  data() {
		return {
			date: '',
			name: '',
      imgUrl: require('../../assets/img/qrcode.png'),
      qrCodeObj: {}, // qrcode配置项
      qrCodeRender: false // 是否渲染
		}
	},
	mounted() {
    document.title = '访客通行证'
    this.init()
	},
	methods: {
    // 初始化
		init() {
      const { name, date, img } = this.$route.query
      this.name = name ? name : ''
      console.log('名字base64：', this.name)
      this.name = this.name.replace(/\s+/g, '+')
      console.log('名字去除空格', this.name)
      this.name = Base64.decode(this.name)
      console.log('解密：', this.name)
			this.date = date ? date : moment(new Date).format('YYYY-MM-DD')
      console.log(this.$route)
      console.log('图片base64', img)
      const des = img.replace(/\s+/g, '+')
      console.log('空格转+号：', des)
      const result = Base64.decode(des);  
      console.log('解密：', result)
      this.qrcode(result)
    },
    // 配置二维码解析options
    qrcode(text) {
      const width = this.$refs.qrcodeWrapper.offsetWidth * 0.8 || 180
      this.qrCodeObj = {
        text: text,
        width: width,
        height: width
      }
      this.qrCodeRender = true
    }
	}
}
</script>
<style>
.share {
	position: absolute;
  width: 100%;
	height: 100%;
	text-align: center;
}
.share p {
	margin: 0 0 2px 0;
}
.share .bg-bottom-wrapper {
	position: absolute;
	z-index: -1;
	width: 100%;
	height: 100%;
	opacity: .9;
	background: #000;
}
.share .bg-wrapper {
  display: flex;
	justify-content: center;
	position: absolute;
	top: 8vh;
	left: 10vw;
	z-index: 1;
	height: 76vh;
	width: 80vw;
	/* background: url('../../assets/img/bg5.png');
	background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
	border-radius: 10px; */
}
.share .bg-wrapper img {
	position: relative;
	width: 100%;
}
.share .bg-wrapper .qrcode-wrapper {
	position: absolute;
	/* left: 15.4vw; */
	top: 34vh;
	width: 32vh;
	/* padding-top: 28vh; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.share .bg-wrapper .qrcode-wrapper img {
  margin: auto;
	width: 90%;
	height: 90%;
}
.share .bg-wrapper .qrcode-text-wrapper {
	position: absolute;
	width: 100%;
	font-size: 14px;
}
.share .bg-wrapper .text-top {
	top: 28vh;
}
.share .bg-wrapper .text-bottom {
	bottom: 4vh;
}
.share .tip-wrapper {
	position: absolute;
	width: 100%;
	bottom: 10vh;
	color: #fff;
	font-size: 18px;
	letter-spacing: 2px;
}
</style>