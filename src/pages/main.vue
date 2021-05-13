<template>
    <div class="uni-container">
			<div class="title-wrapper">
				<van-cell :center="true" @click="openHelp" title="MQTT连接" value="获取帮助" />
			</div>
			<van-field v-model="ipAddress" clearable label="IP地址" placeholder="请输入IP地址及协议和端口" />
			<div class="head-wrapper">
				<van-button type="primary" size="small" :disabled="disabled" :loading="loading" @click="handleLink">连接</van-button>
				<van-button type="warning"  size="small" @click="handleClose">关闭</van-button>
				<van-button  size="small" @click="openMQTTList">MQTT服务器列表</van-button>
				<van-button  size="small" @click="saveIpAddress">保存IP</van-button>
			</div>

			<van-field center clearable v-model="suBtopic" label="主题" placeholder="请输入要订阅的主题" />
		
			<div class="btn-wrapper">
				<van-button type="primary" block :disabled="subDisabled" @click="handleSub">订阅</van-button>
			</div>

			<!-- <div v-if="subList.length">
				<van-cell title="已订阅的主题" />
				<div style="max-height: 100px; overflow-y: scroll;">
					<van-list>
						<van-cell  v-for="item in subList" @click="handleRemoveSub(item.topic)" :title="item.topic" :key="item.key"/>
					</van-list>
				</div>
			</div> -->
	
			<van-field v-model="pubTopic" clearable label="主题" placeholder="请输入要发送的主题" />
			<van-field v-model="content" clearable label="内容"  rows="3" type="textarea" placeholder="请输入要发送的内容" />
	
			<div class="btn-wrapper">
				<van-button type="info" block :disabled="pubDisabled" @click="handlePub">发布</van-button>
			</div>

		<!-- <div v-if="list.length">
			<van-cell title="当前收到的消息" />
			<van-cell :title="cMessage.message" :rightText="cMessage.time" :value="cMessage.topic"/>
			<div  v-if="list.length > 1">
				<van-cell title="历史的消息" type="line"></van-cell>
				<div style="height: 200px;">
					<div style="max-height: 200px; overflow-y: scroll;">
						<van-list>
							<van-cell v-for="item in list" :title="item.message" :key="item.key" :rightText="item.time" :value="item.topic"/>
						</van-list>
					</div>
				</div>
			</div>
		</div> -->

		<div class="head-wrapper">
			<van-button  @click="showMessageList = true" :disabled="this.list.length === 0">查看消息</van-button>
			<van-button  @click="showTopicList = true" :disabled="this.subList.length === 0">查看已订阅的主题</van-button>
			<van-button  @click="showUnTopicList = true" :disabled="this.subList.length === 0">取消已订阅的主题</van-button>
		</div>

		<van-popup v-model="showTopicList" position="left" :style="{ height: '100%', width: '30%', padding: '10px' }">
      <van-list>
				<van-button v-for="item in subList" :key="item.key" block plain type="primary" @click="handleSetPubTopic(item.topic)">{{ item.topic }}</van-button>
			</van-list>
		</van-popup>

		<van-popup v-model="showMessageList" position="top"  :style="{ height: '30%' }">
      <van-list>
				<van-cell v-for="item in list" :title="item.message" :key="item.key" :rightText="item.time" :value="item.topic"/>
			</van-list>
		</van-popup>

		<van-popup v-model="showMQTTList" position="bottom"  :style="{ height: '30%' }">
      <van-list>
				<van-cell  v-for="item in MQTTList" @click="handleSetBorker(item.ipAddress)" :title="item.borker" :key="item.key"/>
			</van-list>
		</van-popup>

		<van-popup v-model="showUnTopicList" position="right"  :style="{ height: '100%', width: '30%', padding: '10px' }">
      <van-list>
				<van-button v-for="item in subList" :key="item.key" block plain type="danger" @click="handleRemoveSub(item.topic)">{{ item.topic }}</van-button>
			</van-list>
		</van-popup>
    </div>
</template>
<script>
import mqtt from 'mqtt'
import { mapState } from 'vuex';
	export default {
		components: {
		},
		data() {
			return {
				pubTopic: '',
				suBtopic: '',
				content: '',
				// 连接选项
				options: {
					clean: true, // true: 清除会话, false: 保留会话
					connectTimeout: 4000, // 超时时间
						// 认证信息
					clientId: 'mqtt_test_from_esp',
				},
				client: null,
				list: [],
				subList: [],
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				cMessage: {},
				loading: false,
				disabled: false,
				subDisabled: true,
				pubDisabled: true,
				ipAddress: '',
				showMQTTList: false,
				showMessageList: false,
				showTopicList: false,
				showUnTopicList: false,
				MQTTList: [{
					borker: 'Mosquitto',
					ipAddress: 'ws://test.mosquitto.org:8080'
				}]
			};
		},
		mounted() {
			const ipAddress = localStorage.getItem('ipAddress');
			console.log(ipAddress)
			if(ipAddress) {
				this.ipAddress = ipAddress
				this.MQTTList.push({
					borker: ipAddress,
					ipAddress
				})
			}
		
		},
		computed: {
			...mapState({
				mqttConfig: state => state.mqttConfig
			})
		},
		methods: {
		// ...mapMutations(['setMenu', 'setMatchLeftWindow', 'setLeftWinActive', 'setActiveOpen']),
		handleClose() {
			this.client.end(true, () => {
				this.$notify({ type: 'success', message: 'MQTT已关闭	' });
				console.log('关闭MQTT连接...')
				this.disabled = false
				this.pubDisabled = true
				this.subDisabled = true
				this.list = []
				this.subList = []
				this.pubTopic = ''
				this.suBtopic = ''
				this.content = ''
			})
		},
		handleSetBorker(ipAddress) {
			this.ipAddress = ipAddress
			this.showMQTTList = false
		},
		saveIpAddress() {
			localStorage.setItem('ipAddress', this.ipAddress)
			this.$notify({ type: 'success', message: '已存储到浏览器中' });
		},
		openHelp() {
			window.open("https://github.com/pengqiangsheng")
		},
		handleSetPubTopic(pubTopic) {
			this.pubTopic = pubTopic
			this.showTopicList = false
		},
		openMQTTList() {
			this.showMQTTList = true
		},
		handleRemoveSub(topic) {
			this.client.unsubscribe(topic, (err) => {
				this.$notify({ type: 'success', message: topic + '已取消订阅' });
				console.log('取消订阅：', topic, err)
				const index = this.subList.findIndex(item => item.topic === topic)
				if(index > -1) {
					this.subList.splice(index, 1)
				}
				this.showUnTopicList = false
			})
		},
		handleLink() {
			this.loading = true
			this.options.clientId = this.mqttConfig.clientId
			const connectUrl = this.ipAddress || "ws://192.168.1.3:8080"
			// const connectUrl = this.mqttConfig.prefix + "://" + this.mqttConfig.ipAddress
			const loadingV1 = this.$loadingV1({
        message: '正在连接，请稍等！',
        type: 'loading',
        duration: 0
      })
			this.client = mqtt.connect(connectUrl, this.options)
			this.client.on('reconnect', (error) => {
				loadingV1.close()
				console.log('正在重连:', error)
				this.loading = false
			})

			this.client.on('connect', ({ cmd }) => {
				this.$notify({ type: 'success', message: '连接成功' });
				loadingV1.close()
				console.log('连接信息：' + cmd)
				this.loading = false
				this.disabled = true
				this.pubDisabled = false
				this.subDisabled = false
			})
			this.client.on('error', (error) => {
				console.log('连接失败:', error)
				this.$notify('连接失败');
				loadingV1.close()
				this.loading = false
			})
			this.client.on('close', () => {
				console.log('连接关闭')
			})
			this.client.on('disconnect', () => {
				console.log('连接中断')
			})
			this.client.on('offline', () => {
				console.log('MQTT离线')
			})
			this.client.on('end', () => {
				console.log('MQTT客户端关闭连接')
			})
			this.client.on('packetsend', (packet) => {
				console.log('发送的包数据：', packet)
			})
			this.client.on('packetreceive', (packet) => {
				console.log('收到的包数据：', packet)
			})
			this.client.on('message', (topic, message, packet) => {
				var myDate = new Date();
				console.log('收到消息：', topic, message.toString(), packet)
				// this.scrollTop += 70
				this.list.push({topic,
				message: message.toString(),
				time: myDate.toLocaleString(),
				key: myDate.valueOf()
				})
				this.cMessage = {
				topic,
				message: message.toString(),
				time: myDate.toLocaleString(),
				key: myDate.valueOf()
				}
			})

		},
		handlePub() {
			if(this.pubTopic && this.content) {
				this.client.publish(this.pubTopic, this.content, err => {
					if(!err) this.$notify({ type: 'success', message: this.pubTopic + '已发送' });
					else this.$notify('发送失败')
				})
			}
		},
		handleSub() {
			if(!this.suBtopic) return
			const index = this.subList.findIndex(item => item.topic === this.suBtopic)
			if(index > -1) {
				return this.$notify('请不要重复订阅' + this.suBtopic)
			}
			this.client.subscribe(this.suBtopic, err => {
				if(!err) {
					console.log('订阅主题：', this.suBtopic)
					this.$notify({ type: 'success', message: this.suBtopic + '已订阅' });
					this.subList.push({
						topic: this.suBtopic
					})
				}else {
					this.$notify('订阅失败')
				}

			})
		}
	}
};
</script>

<style lang="less">
		.uni-container {
			position: absolute;
			height: 100%;
			width: 100%;
			background-color: #f7f8fa;
			text-align: left;
			font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
			.title-wrapper {
				margin-bottom: 10px;
			}
			.head-wrapper {
				padding: 10px;
			}
			.btn-wrapper {
				padding: 10px;
			}
			.demo-child {
				width: 40px;
				height: 40px;
				background: #f2f3f5;
				border-radius: 4px;
			}
		}
		
</style>
