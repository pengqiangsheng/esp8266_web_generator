<template>
	<view>
		<page-head title="MQTT配置"></page-head>
		<view class="uni-padding-wrap uni-common-mt">
			<form @submit="formSubmit" @reset="formReset">
				<view class="uni-form-item uni-column">
					<view class="title">代理IP</view>
					<input class="uni-input" name="ipAddress"  @input="handleInput" v-model="ipAddress" placeholder="请输入URL和端口" />
					<view class="title">比如：192.168.1.6:1883/mqtt.aliyun.io</view>
				</view>
				<view class="uni-form-item uni-column uni-flex">
					<view class="uni-row uni-flex title">
						<view class="客户端ID">
							客户端ID
						</view>
						<button type="primary" size="mini" @click="handleRandom">随机生成</button>
					</view>
					<view class="">
						<input class="uni-input" v-model="clientId" name="clientId" placeholder="clientId" />
					</view>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">连接协议</view>
					<radio-group name="gender" @change="radioChange">
						<label>
							<radio value="mqtt" /><text>TCP</text>
						</label>
						<label>
							<radio value="mqtts" /><text>加密 TCP</text>
						</label>
						<label>
							<radio value="ws" /><text>WebSocket</text>
						</label>
						<label>
							<radio value="wss" /><text>加密 WebSocket</text>
						</label>
						<label>
							<radio value="wxs" /><text>微信小程序</text>
						</label>
						<label>
							<radio value="alis" /><text>支付宝小程序</text>
						</label>
					</radio-group>
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">操作	</view>
					<view class="uni-flex uni-row">
						<view class="flex-item ">
							<span>连接</span><switch @change="switch1Change" name="switch" />
						</view>
						<view class="flex-item ">
							<span>可选配置</span><switch @change="switch2Change" name="switch" />
						</view>
					</view>
				</view>
				<view class="uni-form-item uni-column" v-if="showSubConfig">
					<view class="title">认证信息</view>
					<view>
						<input class="uni-input" v-model="username" name="username" placeholder="username" />
					</view>
					<view>
						<input class="uni-input" v-model="password" name="password" placeholder="password" />
					</view>
					<view>
						说明：可选配置可写可不写，不写将默认生成clientId，无账号连接
					</view>
				</view>
				<view class="uni-btn-v">
					<button @click="saveConfig">保存</button>
					<!-- <button type="default" form-type="reset">Reset</button> -->
				</view>
			</form>
		</view>
	</view>
</template>
<script>
import { mapActions } from 'vuex';
export default {
	data() {
		return {
			showSubConfig: false,
			ipAddress: '',
			username: '',
			password: '',
			prefix: '',
			clientId: ''
		}
	},
	methods: {
		...mapActions(['initConfig']),
		saveConfig() {
			try {
				this.initConfig({
					ipAddress: this.ipAddress,
					username: this.username,
					password: this.password,
					prefix: this.prefix,
					clientId: this.clientId
				});
				console.log('success');
			} catch (e) {
					// error
			}
		},
			switch1Change() {
			// console.log('switch1 发生 change 事件，携带值为', e.target.value)
		},
		switch2Change() {
			// this.showSubConfig = e.target.value
		},
		handleInput() {
			console.log(this.ipAddress)
		},
		radioChange() {
			// this.prefix = e.target.value
		},
		handleRandom() {
			console.log('random')
		}
	}
}
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>
