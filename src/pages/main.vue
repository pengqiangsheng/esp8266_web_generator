<template>
    <div class="uni-container">

			<div class="title-wrapper">
				<van-dropdown-menu>
					<van-dropdown-item @change="getIpAndPort" v-model="ip" :options="ipOption" />
					<van-dropdown-item @change="getIpAndPort" v-model="port" :options="portOption" />
				</van-dropdown-menu>
			</div>

			<van-field v-model="ipAddress" clearable disabled label="IP地址" placeholder="请输入IP地址及协议和端口">
				<template #button>
					<van-button size="small" type="primary" v-show="!disabled" :disabled="disabled" :loading="loading" @click="handleLink">连接</van-button>
					<van-button type="warning"  size="small" v-show="disabled" @click="handleClose">关闭</van-button>
				</template>
			</van-field>

			<van-field center clearable v-model="suBtopic" label="订阅主题" placeholder="请输入要订阅的主题">
				<template #button>
					<van-button size="small" type="primary" :disabled="subDisabled"  @click="handleSub">订阅</van-button>
				</template>
			</van-field>
		
			<van-field v-model="pubTopic" clearable label="发布主题" placeholder="请输入要发送的主题">
				<template #button>
					<van-button size="small" type="info" :disabled="subList.length === 0"  @click="showTopicList = true">选择</van-button>
				</template>
			</van-field>	
			<van-field v-model="content" clearable label="发布内容"  rows="3" type="textarea" placeholder="请输入要发送的内容">
				<template #button>
					<van-button size="small" type="info" :disabled="pubDisabled"  @click="handlePub">发布</van-button>
				</template>
			</van-field>
	
			<div class="footer-wrapper">
				<div class="icon-wrapper" @click="handleMore">
					<span class="more">更多</span>
					<van-icon :name="showMore ? 'arrow-down': 'arrow'" />
				</div>
				<transition name="van-slide-up">
					<div v-show="showMore">
						<div class="btn-wrapper-row2">
							<van-button block plain type="primary" @click="showConfig = true">新建连接</van-button>
						</div>
						<div class="btn-wrapper-row2">
							<van-button plain type="primary" @click="showMessageList = true" :disabled="list.length === 0">查看消息</van-button>
							<van-button plain type="primary" @click="saveIpAddress">保存当前配置</van-button>
						</div>
						<div class="btn-wrapper-row2">
							<van-button plain type="primary" @click="showTopicList = true" :disabled="subList.length === 0">查看已订阅的主题</van-button>
							<van-button plain type="primary" @click="showUnTopicList = true" :disabled="subList.length === 0">取消已订阅的主题</van-button>
						</div>
					</div>
				</transition>
			</div>

			<van-popup v-model="showTopicList" position="left" :style="{ height: '100%', width: '70%', padding: '10px' }">
				<van-list>
					<div class="topic-wrapper" v-for="item in subList" :key="item.key" >
						<van-button block plain type="primary" @click="handleSetPubTopic(item.topic)">{{ item.topic }}</van-button>
					</div>
				</van-list>
			</van-popup>

			<van-popup v-model="showMessageList" position="top"  :style="{ height: '30%' }">
				<van-list>
					<van-cell v-for="item in list" :key="item.key" :label="item.time" :value="item.message">
						<template #title>
							<van-tag type="success" style="margin-right: 5px;">{{ item.topic }}</van-tag>
							<van-tag plain type="primary">qos:{{ item.qos }}</van-tag>
						</template>
					</van-cell>
				</van-list>
			</van-popup>

			<van-popup v-model="showConfig" position="top">
				<van-cell title="新建一个MQTT连接"/>
				<van-field v-model="form.ip" label="IP" placeholder="请输入ip地址或域名" />
				<van-field v-model="form.port" label="端口" placeholder="请输入端口号" />
				<div class="btn-wrapper">
					<van-button block size="small" plain type="primary" @click="handleSubmit">保存</van-button>
				</div>
			</van-popup>

			<van-popup v-model="showUnTopicList" position="right"  :style="{ height: '100%', width: '70%', padding: '10px' }">
				<van-list>
					<van-badge v-for="item in subList" :key="item.key" >
						<div class="topic-wrapper" >
							<van-button block plain type="danger" @click="handleRemoveSub(item.topic)">{{ item.topic }}</van-button>
						</div>
						<template #content>
							<van-icon name="cross" class="badge-icon" />
						</template>
					</van-badge>
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
				ip: 'test.mosquitto.org',
				port: '8080',
				protocol: 'ws',
				showConfig: false,
				showMessageList: false,
				showTopicList: false,
				showUnTopicList: false,
				showMore: false,
				ipOption: [
					{ text: 'Mosquitto', value: 'test.mosquitto.org' },
					{ text: '192.168.1.3', value: '192.168.1.3' }
				],
				portOption: [
					{ text: '8080', value: '8080' },
					{ text: '9001', value: '9001' }
				],
				form: {
					ip: '',
					port: ''
				}
			};
		},
		computed: {
			ipAddress() {
				return this.protocol + '://' + this.ip + ':' +this.port
			},
			...mapState({
				mqttConfig: state => state.mqttConfig
			})
		},
		mounted() {
			const ipOption = JSON.parse(localStorage.getItem('ipOption'))
			const portOption = JSON.parse(localStorage.getItem('portOption'))
			if(ipOption && ipOption.length) {
				this.ipOption = ipOption
			}
			if(portOption && portOption.length) {
				this.portOption = portOption
			}
			console.log('读取本地存储中...')
			console.log('ipOption: ', ipOption)
			console.log('portOption: ', portOption)
			console.log('读取完毕...')
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
		handleMore() {
			this.showMore = !this.showMore
		},
		handleSetBorker(ipAddress) {
			this.ipAddress = ipAddress
			this.showMQTTList = false
		},
		saveIpAddress() {
			localStorage.setItem('ipOption', JSON.stringify(this.ipOption))
			localStorage.setItem('portOption', JSON.stringify(this.portOption))
			console.log('写入本地存储中...')
			console.log('ipOption: ', this.ipOption)
			console.log('portOption: ', this.portOption)
			console.log('写入完毕...')
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
				this.list.unshift({
					topic,
					qos: packet.qos,
					message: message.toString(),
					time: myDate.toLocaleString(),
					key: myDate.valueOf()
				})
			})

		},
		handlePub() {
			if(!this.pubTopic) return this.$notify('请输入主题名')
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
		},
		focus() {
			this.showMQTTList = true
		},
		handleSubmit() {
			if(!this.form.ip) return this.$notify('请输入ip')
			if(!this.form.port) return this.$notify('请输入端口')
			const indexIp = this.ipOption.findIndex(item => item.value === this.form.ip)
			if(indexIp === -1) {
				this.ipOption.push({
					text: this.form.ip,
					value: this.form.ip
				})
			}
			const indexPort = this.portOption.findIndex(item => item.value === this.form.port)
			if(indexPort === -1) {
				this.portOption.push({
					text: this.form.port,
					value: this.form.port
				})
			}
			this.showConfig = false
			this.form = {
				ip: '',
				port: ''
			}
		},
		getIpAndPort() {
			console.log('目前选择的ip及端口: ', this.ipAddress)
		},
		onConfirm(value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
    },
    onChange(picker, value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      console.log('取消');
    },
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
	.footer-wrapper {
		padding: 5px;
		.icon-wrapper {
			padding: 5px;
			display: flex;
			align-items: center;
			justify-content: left;
			.more {
				font-size: 14px;
			}
			.van-icon {
				color: #323233;
				font-size: 14px;
			}
		}

		.btn-wrapper-row2 {
			display: flex;
			button {
				flex: 1;
				margin: 5px;
			}
		}
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
	.topic-wrapper {
		margin-bottom: 10px;
	}
}
		
</style>
