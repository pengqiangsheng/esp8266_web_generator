<template>
	<div class="auth" >
			<div class="header-wrapper" ref="headerWrapper">
				<div class="header">
					<img src="../../assets/img/header.png">
				</div>
			</div>
			<div class="main-wrapper" >
				<div class="main">
					<div class="line">
						<div class="label">
							<span class="label-right">小区</span>
						</div>
						<div class="context">
							<input type="text" placeholder="选择小区" :value="village" @click="showVillage = true" readonly>
						</div>
					</div>

					<div class="line">
						<div class="label">
							<span>访客姓名</span>
						</div>
						<div class="context">
							<input type="text" placeholder="请输入访客姓名" v-model="name" maxlength="20" >
						</div>
					</div>

					<div class="line">
						<div class="label sex-label">
							<span class="label-right">性别</span>
						</div>
						<div class="context sex">
							<div class="sex-item" :class="{'sex-item-active': sex === '1'}" @click="setValue('1', 'sex')" >
								<div class="img-wrapper">
									<img :src="maleImg">
								</div>
								<div>男生</div>
							</div>
							<div class="sex-item" :class="{'sex-item-active': sex === '0'}"  @click="setValue('0', 'sex')" >
								<div class="img-wrapper">
									<img :src="femaleImg">
								</div>
								<div>女生</div>
							</div>
						</div>
					</div>

					<div class="line">
						<div class="label is-require">
							<span>手机号码</span>
						</div>
						<div class="context">
							<input type="text" placeholder="请输入手机号码" v-model="phone" maxlength="11" oninput="value=value.replace(/[^\d]/g, '')">
						</div>
					</div>


					<div class="line">
						<div class="label">
							<span>驾车来访</span>
						</div>
						<div class="context block">
							<span class="block-item " :class="{'block-item-active': times === '1'}" @click="setValue('1', 'times')">是</span>
							<span class="block-item " :class="{'block-item-active': times === '0'}" @click="setValue('0', 'times')">否</span>
						</div>
					</div>

					<div class="line">
						<div class="label">
							<span>授权类型</span>
						</div>
						<div class="context block" style="justify-content: left;">
							<!-- <span class="block-item "  @click="setValue('1', 'authType')">一次</span> -->
							<span class="block-item block-item-active"   @click="setValue('0', 'authType')">一天</span>
						</div>
					</div>
					
					<div class="line">
						<div class="label">
							<span>到访时间</span>
						</div>
						<div class="context">
							<input type="text" placeholder="选择时间" :value="date" @click="showDate = true" readonly>
						</div>
					</div>


					<div class="line">
						<div class="label">
							<span>访客类型</span>
						</div>
						<div class="context">
							<input type="text" placeholder="选择访客类型" :value="type" @click="showType = true" readonly>
						</div>
					</div>

					<van-row type="flex" justify="space-around" class="btn-wrapper">
							<van-button class="btn" @click="done">生成通行证</van-button>
							<van-button class="btn" @click="sendMessage" v-if="!timer">
								<span>发送短信</span>
							</van-button>
              <van-button class="btn" v-else>{{ count }}秒后可重新发送</van-button>
					</van-row>
				</div>
				
			</div>

			<van-popup v-model="showDate" position="bottom">
				<van-datetime-picker
					v-model="currentDate"
					type="date"
					:min-date="minDate"
					:formatter="formatter"
					@cancel="showDate = false"
					@confirm="(val)=>{onConfirm(val, 'date')}"
				/>
			</van-popup>


			<van-popup v-model="showType" position="bottom">
				<van-picker
					show-toolbar
					:columns="typeList"
					@cancel="showType = false"
					@confirm="(val)=>{onConfirm(val, 'type')}"
				/>
			</van-popup>

			<van-popup v-model="showVillage" position="bottom">
				<van-picker
					show-toolbar
					:columns="columns"
          :value-key="'name'"
					@cancel="showVillage = false"
					@confirm="(val)=>{onConfirm(val.name, 'village')}"
				/>
			</van-popup>

			<van-overlay :show="loading" class="loading-wrapper">
				<div class="block">
					<div>
						<van-loading/>
						<div>加载中</div>
					</div>
				</div>
		</van-overlay>
	</div>
</template>

<script>
import moment from 'moment'
import { Base64 } from 'js-base64'
import {  shareLink, getVisitCode } from '@/api'
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			name: '', // 名字
			phone: '', // 手机号码
			village: '', // 小区
			type: '', // 访客类型
			authType: '1', // 授权类型
			sex: '1', // 性别
			times: '1', // 驾车来访
			showVillage: false,
			showType: false,
      showDate: false,
      isDrive: true,
			// columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
			typeList: ['亲朋', '好友'],
			currentDate: '',
			date: '', // 到访时间
			minDate: new Date(),
			phoneErrorMessage: '',
			maleImg: require('../../assets/img/male_gray.png'),
			femaleImg: require('../../assets/img/female.png'),
			count: 60,
			timer: null,
			loading: false
		}
	},
	watch: {
		phone(val) {
			const reg = /^\d/g
			if(!reg.test(val)) {
				this.phoneErrorMessage = '手机号码输入有误'
			}else if(val.length !== 11){
				this.phoneErrorMessage = '手机号码为11位'
				
			}else {
				this.phoneErrorMessage = ''
			}
		},
		sex(val) {
			if(val === '1') {
				this.maleImg = require('../../assets/img/male_gray.png')
				this.femaleImg = require('../../assets/img/female.png')
			}else {
				this.femaleImg = require('../../assets/img/female_gray.png')
				this.maleImg = require('../../assets/img/male.png')
			}
		}
  },
  computed: {
    ...mapGetters({
      columns: 'villageList'
    })
  },
	mounted() {
    document.title = '访客通行证'
    this.date = moment().format('YYYY-MM-DD')
    this.resetLayout()
    this.init()
	},
	methods: {
    init() {
      const { tId } = this.$route.query
      this.columns.forEach(item => {
        if(item.id === tId) {
          this.village = item.name
        }
      })
    },
    // 根据设备尺寸兼容
		resetLayout() {
			if(this.$width>= 400){ 
				console.log('大于400')
				if(!this.$deviceIsIOS) {
					console.log('头部变高')
					this.$refs.headerWrapper.style.height = '120px'
				}
				// phoneType = "iphone6 plus"
			}else if(this.$width>370){ 
				// phoneType = "iphone6"
			}else if(this.$width>315){ 
				// phoneType = "iphone5 or iphone5s"
			}
		},
    onConfirm(value, name) {
			if(name === 'date') {
				this.date = moment(value).format('YYYY-MM-DD')
			}else {
				this[name] = value
			}
			this.showVillage = false
			this.showType = false
			this.showDate = false
    },
    // 日期选择格式化
		formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      }
      return value;
    },
    // 设置值
		setValue(val, name) {
			console.log('change '+name, 'val '+ val)
      this[name] = val
    },
    // 提交
		done() {
      if(!this.validatePhone()) {
        return
      }
			const data = {
				name: Base64.encode(this.name) || '',
				phone: this.phone,
				village: this.village,
				type: this.type,
				authType: this.authType,
				sex: this.sex,
				times: this.times,
				date: this.date
      }
   
      console.log(data)
      console.log(Base64.decode(data.name))
      this.shareLink(0)
    },
    // 验证手机号码
    validatePhone() {
      if(!(this.phone && this.phone.length === 11)) {
				this.$notify({
					message: '请输入正确的手机号码',
					color: '#fff',
					background: '#B067A7'
				})
				return 0
      }
      return 1
    },
    // 分析接口
    shareLink(send) {
      const { appKey, neighNo, phoneNum, switchKey } = this.$route.query
      this.loading = true
      const params = {
        appKey: appKey,
        neighNo: neighNo,
        phoneNum: phoneNum,
        timeStamp: new Date().getTime(),
        send: send,
        visitName: this.name,
        visitTime: this.date,
        visitPhone: this.phone,
        switchKey: switchKey
      }
      shareLink(params).then(res => {
        res = res.data
        const { result, data, message } = res
        this.loading = false
        if(result === 1) {
          if(message.indexOf('短信发送成功') > -1) { // 用户点击发送短信
            // this.$dialog.alert({
            //   message: message
            // })
            this.$notify({type: 'success', message: message})
          }else { // 用户点击生成通行证
            // axios.get(data)
            //   .then(this.generatePass)
            //   .catch(()=>{
            //     this.$notify('请求失败')
            //   })

            getVisitCode(data)
              .then(this.generatePass)
              .catch(()=>{
                this.$notify('请求失败')
              })
          }
        }else {
          this.$notify('sharelink请求失败')
        }
        console.log(res)
      }).catch(()=>{
        this.loading = false
      })
    },
    // 生成访客通行证
    generatePass(res) {
      let img = null
      res = res.data
      const { result, data } = res
      if(result === 1) {
        img = data
      }else {
        this.$notify('生成访客通行证失败')
      }
      console.log(res)
      const name = Base64.encode(this.name)
      const url = window.location.href.split('index.html')[0]
      window.location.assign(`${url}share.html?img=${img}&name=${name}&date=${this.date}`)
      // this.$router.push({
      //   path: `${url}?#/share`,
      //   query: {
      //     name: Base64.encode(this.name) || '',
      //     date: this.date || '',
      //     img: img
      //   }
      // })
    },
    // 发送短信
		sendMessage() {
      console.log('sendmessage')
      if(!this.validatePhone()) {
        return
      }
      this.countdown()
      this.shareLink(1)
    },
    // 倒计时
    countdown() {
      const TIME_COUNT = 60 // 倒计时一分钟
			this.count = TIME_COUNT
			if (!this.timer) {
				this.timer = setInterval(() => {
					if (this.count > 0 && this.count <= TIME_COUNT) {
						this.count--
					} else {
						clearInterval(this.timer)
						this.timer = null
					}
				}, 1000)
			}
    }
  }
}
</script>
<style>
	.auth {
		position: absolute;
		overflow: hidden;
		width: 100%;
		height: 100%;
		background: url('../../assets/img/bg1.png');
		background-size: cover;
    background-repeat: no-repeat;
    background-position: 50% 50%;
	}
	.auth .header-wrapper {
		position: relative;
		height: 100px;
		width: 100%;
	}
	.auth .header {
		position: absolute;
		left: 36px;
		bottom: 6px;
	}
	.auth .header img {
		height: 5vh;
	}
	.auth .main-wrapper {
		position: relative;
		width: 100%;
		height: 80vh;
		padding: 0 30px;
		/* overflow: hidden; */
		box-sizing: border-box;
	}
	.auth .main {
    /* height: 100%; */
    box-sizing: border-box;
		padding: 20px 0 30px 0;
		background: url('../../assets/img/bg2.png');
	}
	.auth .main .line {
		position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 0.6vh 16px;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
	}
	.auth .label {
		position: relative;
		width: 100px;
		line-height: 36px;
		color: #fff;
	}
  .auth .is-require > span::after{
		position: relative;
    content: "*";
		line-height: 36px;
		color: red;
	}
	.auth .label-right {
		position: relative;
    left: 12px;
	}
	.auth .context {
		flex: 1;
		position: relative;
    overflow: hidden;
    color: #969799;
    text-align: right;
    vertical-align: middle;
	}
	.auth .context input {
		-webkit-appearance: none;
    background-color: #442676;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #5A3E89;
    box-sizing: border-box;
    color: #DDDBE1;
    display: inline-block;
    font-size: inherit;
    height: 36px;
    line-height: 36px;
    outline: none;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
	}
	.auth input::-webkit-input-placeholder {
		color: #BEBCC2;
	}
	.auth input::-moz-input-placeholder {
		color: #BEBCC2;
	}
	.auth input::-ms-input-placeholder {
		color: #BEBCC2;
	}
	.auth .context input:focus {
		outline: none;
    border-color: #409eff;
	}
	.auth .sex {
		display: flex;
		justify-content: space-around;
	}
	.auth .sex .sex-item {
		color: #832E79;
	}
	.auth .sex .sex-item-active {
		color: #CBCBCB;
	}
	.auth .sex .img-wrapper img {
		width: 30px;
	}
	.auth .sex-label {
		line-height: 61px;
	}
	.auth .block {
		display: flex;
		justify-content: space-around;
	}
	.auth .block-item {
		width: 40px;
		padding: 6px 10px;
		text-align: center;
		border-radius: 4px;
		color: #fff;
		background: #442676;
		border: 1px solid #5A3E89;
	}
	.auth .block-item-active {
		background: #A04E96;
		border: 1px solid #55174E;
	}
	.auth .btn-wrapper {
		margin-top: 2vh;
	}
	.auth .btn {
		color: #4A0642;
		background: #A04E96;
		border: 1px solid #61295B;
		border-radius: 8px;
	}
	@media screen and (max-height: 700px) {
    .auth .header-wrapper {
			height: 60px;
		}
	}
</style>