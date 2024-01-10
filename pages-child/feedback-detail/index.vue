<template>
	<view class="page">
		<!-- 顶部导航 -->
		<m-navbar bgColor="transparent" textColor="#fff" :borderBottom="false" value="page.反馈详情" i18n></m-navbar>
		<!-- 内容区域 -->
		<m-scroll :isLoading="false" :isCustomRefresh="false" :scrollStyle="scrollStyle">
			<view class="pt-1">
				<view class="d-flex p-2 pb-3">
					<view class="feedback-label text-white flex-shrink font-weight">
						{{$t('您的反馈')}}:
					</view>
					<view class="feedback-desc ml-2">
						<view class="feedback-desc-text">
							{{detail.opinion}}
						</view>
						<view class="feedback-desc-image d-flex flex-wrap">
							<view class="img" v-for="(item, i) in detail.pics" :key="i" @click="openPreview(0, i)">
								<u-image width="100%" height="100%" :src="item" mode="widthFix"></u-image>
							</view>
						</view>
					</view>
				</view>
				<view class="d-flex mt-1 p-2 pb-3">
					<view class="feedback-label text-white flex-shrink font-weight">
						{{$t('反馈回复')}}:
					</view>
					<view class="feedback-desc ml-2">
						<view class="feedback-desc-text">
							{{detail.reply}}
						</view>
						<!-- <view class="feedback-desc-image d-flex flex-wrap">
							<view class="img mt-2" v-for="(item, i) in detail.replyImgs" :key="i"
								@click="openPreview(1, i)">
								<u-image width="100%" height="100%" :src="item" mode="widthFix"></u-image>
							</view>
						</view> -->
					</view>
				</view>
			</view>
		</m-scroll>
	</view>
</template>

<script>
	import { requestData } from '@/utils/index.js'
	import { getFeedbackDetail } from '@/utils/request/api/get.js'
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	export default {
		components: {
			MScroll
		},
		data() {
			return {
				id: 0,
				detail: {}
			}
		},
		onLoad(options) {
			this.id = this.$tools.Navigate.receivePageData(options)
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.getData()
			},
			// 获取数据
			async getData() {
				let result = requestData({id: this.id})
				let res = await getFeedbackDetail(result)
				if(res.code == 1) {
					this.detail = res.data
				}
			},
			// 预览图片
			openPreview(e, i) {
				uni.previewImage({
					urls: e == 0 ? this.detail.imgs : this.detail.replyImgs,
					current: i,
					indicator: 'default',
					loop: false
				})
			}
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - ${this.$store.state.navbarHeight}px - env(safe-area-inset-bottom) - ${this.$store.state.statusHeight}px)`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		.feedback-desc {
			.feedback-desc-text {
				color: #f1f1f1;
			}

			.feedback-desc-image {
				.img {
					margin-top: 13rpx;
					width: 32%;
					margin-right: 2%;
				}

				.img:nth-child(3n) {
					margin-right: 0;
				}
			}
		}
	}
</style>