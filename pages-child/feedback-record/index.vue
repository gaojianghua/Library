<template>
	<view class="page">
		<m-navbar bgColor="transparent" :borderBottom="false" textColor="#fff" value="page.反馈记录" i18n></m-navbar>
		<m-scroll :isLoading="isLoading" i18n :scrollStyle="scrollStyle" :load="load" @loadmore="loadmore" bgColor="transparent"
			@onRefresh="onRefresh">
			<u-empty v-if="load != 0 && list.length == 0" mode="list" :text="$t('暂无数据')"
				icon="http://cdn.uviewui.com/uview/empty/list.png">
			</u-empty>
			<view v-if="list.length != 0" class="px-2">
				<view  class="item rounded-1 d-flex a-center j-sb p-2 mt-2"
					v-for="(item, i) in list" :key="i" @click="openDetail(i)">
					<view class="left d-flex a-center">
						<u-image v-if="item.picx" radius="10" width="100rpx" height="100rpx" :src="item.picx"></u-image>
						<view class="info ml-2 d-flex flex-column j-sb">
							<view class="info-title text-white">
								{{item.opinion}}
							</view>
							<view class="info-time">
								{{item.addtime}}
							</view>
						</view>
					</view>
					<view class="btns border-2 rounded-1 px-3"
						:class="item.status == 0 ? 'text-warning border-warning' : 'text-white border-white'">
						{{item.status == 0 ? $t('处理中') : $t('已回复')}}
					</view>
				</view>
			</view>
		</m-scroll>
	</view>
</template>

<script>
	import { requestData } from '@/utils/index.js'
	import { getFeedbackList } from '@/utils/request/api/get.js'
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	export default {
		components: {
			MScroll
		},
		data() {
			return {
				load: 0,
				isLoading: true,
				query: {
					page: 1,
					size: 10
				},
				list: [],
				total: 0
			}
		},
		onLoad() {
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.getData()
			},
			//
			openDetail(i) {
				if(this.list[i].status != 0) {
					this.$tools.Navigate.navigateTo('/pages-child/feedback-detail/index', this.list[i].id)
				}
			},
			// 获取数据
			async getData(e) {
				let result = requestData(this.query)
				let {
					list,
					code,
					nums
				} = await getFeedbackList(result)
				if (code == 1) {
					if (e) { // 加载更多
						this.list = this.list.concat(list)
					} else {
						this.list = list
						this.total = nums
					}
					if (this.query.page * this.query.size >= this.total) {
						return this.load = 1
					} else {
						return this.load = 2
					}
				}
				
			},
			// 下拉刷新
			onRefresh() {
				this.query.page = 1
				this.getData()
			},
			// 加载更多
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.query.page++
				this.istrig = false
				let time = setTimeout(() => {
					this.getData('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
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
	.item{
		background-color: #151515;
		.info {
			.info-time {
				color: #999;
				font-size: 26rpx;
			}
		}
	}
</style>
