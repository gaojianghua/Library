<template>
	<view class="page">
		<!-- 顶部导航栏 -->
		<m-navbar bgColor="transparent" :borderBottom="false" textColor="#fff" value="page.意见反馈" i18n>
			<view slot="right" class="position-absolute right-0 text-white pr-3" @click="$tools.Navigate.navigateTo('/pages-child/feedback-record/index')">
				{{$t('page.反馈记录')}}
			</view>
		</m-navbar>
		<!-- 内容区域 -->
		<view class="content mt-1 p-3">
			<view class="bottom d-flex a-center py-3">
				<u-textarea height="100"
					:customStyle="{caretColor: '#6F43FE', padding: '0', backgroundColor: '#f1f1f1'}" border="none"
					v-model="query.opinion" :placeholder="$t('描述您的问题，我们会尽快为您处理！')">
				</u-textarea>
			</view>
		</view>
		<u-gap height="2rpx" bgColor="#151515"></u-gap>
		<!-- 图片上传 -->
		<view class="content mt-1 p-3">
			<u-upload :maxCount="6" width="80" height="80" :fileList="fileList" @afterRead="afterRead"
				@delete="deletePic" name="file" multiple></u-upload>
		</view>
		<!-- 提交按钮 -->
		<view class="position-fixed bottom-0 left-0 p-3 w-100">
			<view @click="switchFeedback" class="btons d-flex a-center j-center text-white letter-2">
				{{$t('提交反馈')}}
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { requestData } from '@/utils/index.js'
	import { feedback } from '@/utils/request/api/get.js'
	export default {
		data() {
			return {
				query: {
					opinion: '',
					pics: ''
				},
				fileList: []
			}
		},
		methods: {
			// 语音识别
			openMic() {

			},
			// 提交反馈
			async switchFeedback() {
				if (!this.query.opinion) {
					return this.$refs.uToast.show({
						message: this.$t('请输入您的反馈信息！'),
						type: 'warning',
						duration: 1500
					})
				}
				let result = requestData(this.query)
				let res = await feedback(result)
				if(res.code == 1) {
					this.query.opinion = ''
					this.query.pic = ''
					this.fileList = []
					this.$refs.uToast.show({
						message: this.$t('您的反馈已提交，我们会尽快为您处理！'),
						type: 'success',
						duration: 1500
					})
				}
			},
			//上传图片事件
			afterRead(e) {
				let result = requestData({})
				uni.uploadFile({
					url: uni.uniEnv.baseURL + '/index.php/appv1/opinion/upload',
					filePath: e.file[0].url,
					name: 'file',
					formData: result,
					header: {
						'token': this.$store.state.token || ''
					},
					success: (res) => {
						console.log(res)
						let srcObj = {
							url: JSON.parse(res.data).img
						}
						this.fileList.push(srcObj)
						if (this.fileList.length > 1) {
							let arr = []
							this.fileList.forEach((v, i) => {
								arr.push(v.url)
							})
							this.query.pics = arr.join(',')
						} else {
							this.query.pics = this.fileList[0].url
						}
					},
					fail: (err) => {
						this.fileList = []
						this.$refs.uToast.show({
							message: this.$t('请上传png，jpg，jpeg格式的图片'),
							type: 'warning',
							duration: 1500
						})
					}
				})
			},
			//删除图片事件
			deletePic(e) {
				this.fileList.splice(e.index, 1)
				let arr = []
				this.fileList.forEach((v, i) => {
					arr.push(v.url)
				})
				this.query.pics = arr.join(',')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		.content {
			.bottom {
				background-color: #f1f1f1;
				border-radius: 50rpx;
				padding: 0 30rpx;
			}
		}

		.btons {
			font-size: 30rpx;
			border-radius: 50rpx;
			height: 88rpx;
			width: 690rpx;
			margin: 0 auto;
			background-color: #6F43FE;
		}

		.btons:active {
			background-color: #6F43FE80;
		}
	}
</style>