<template>
	<view class="page">
		<m-navbar :borderBottom="false" :bgColor="$store.state.bgColor" value="page.已完结" i18n>
		</m-navbar>
		<m-scroll :isLoading="isLoading" i18n :load="load" :scrollStyle="scrollStyle" @loadmore="loadmore"
			bgColor="transparent" @onRefresh="onRefresh">
			<view class="list px-2">
				<u-empty v-if="load != 0 && list.length == 0" mode="list" :text="$t('暂无数据')"
					icon="/static/img/common/white-empty.png">
				</u-empty>
				<view class="item position-relative" v-for="(item, i) in list" :key="i" @click="itemClick(item)">
					<view class="position-absolute d-flex top-0 mt-3 index-2" style="left: 30rpx;">
						<view class="position-relative mr-2">
							<u-image radius="6" width="215rpx" height="260rpx" :src="item.picx"></u-image>
							<view v-if="item.is_minors == 1"
								class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
								style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
								18
							</view>
						</view>
						<view class="d-flex flex-1 flex-column">
							<view class="d-flex a-center mt-1">
								<view class="item-name text-white line-h text-ellipsis1">
									{{item.name}}
								</view>
							</view>
							<view class="item-school mt-1">
								{{item.type_name}} · {{item.state}}
							</view>
							<view class="text-ellipsis2 item-type mt-1" style="width: 425rpx;">
								{{item.text}}
							</view>
						</view>
					</view>
					<view class="caed py-2 pr-3 j-around d-flex position-absolute left-0 w-100 index-1">
						<view class="caed-l j-sb flex-shrink d-flex a-center flex-column">
							<view class="line-h font" style="color: #77799A;">
								{{$t('评分')}}
							</view>
							<view class="d-flex a-center">
								<u-icon name="star-fill" size="20" color="#6F43FE"></u-icon>
								<view class="font-weight ml-1 line-h" style="color: #ED6824;">
									{{item.score}}{{$t('分')}}
								</view>
							</view>
						</view>
						<view class="caed-c mx-3"></view>
						<view class="caed-r d-flex a-center j-sb flex-column">
							<view class="line-h font" style="color: #77799A;">
								{{$t('作者')}}
							</view>
							<view class="text-white text-center font line-h auto-feed-letter">
								{{item.author}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</m-scroll>
	</view>
</template>

<script>
	import MNavbar from '@/main_modules/main-ui/m-navbar/index.vue'
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import {
		getComicData
	} from '@/utils/request/api/get.js'
	import {
		requestData
	} from '@/utils/index.js'
	export default {
		components: {
			MScroll,
			MNavbar
		},
		data() {
			return {
				isLoading: true,
				list: [],
				query: {
					page: 1,
					size: 20,
					cid: 0,
					pay: 0,
					sort: 'addtime',
					state: 1
				},
				load: 0,
				istrig: true
			}
		},
		created() {
			this.getBook()
		},
		methods: {
			async getBook(e) {
				let result = requestData(this.query)
				let {
					list,
					nums,
					code
				} = await getComicData(result)
				if (code == 1) {
					if (e) { // 加载更多
						this.list = this.list.concat(list)
					} else {
						this.list = list
					}
					if (this.query.page * this.query.size >= nums) {
						return this.load = 1
					} else {
						return this.load = 2
					}
				}
			},
			// 下拉刷新
			onRefresh() {
				this.query.page = 1
				this.getBook()
			},
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.query.page++
				this.istrig = false
				let time = setTimeout(() => {
					this.getBook('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
			itemClick(i) {
				uni.navigateTo({
					url: '/pages-child/comic-detail/index?id=' + i.id
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
	.list {
		.item {
			height: 330rpx;
			
			.caed-c{
				height: 70rpx;
				width: 2rpx;
				background-color: #6F43FE;
			}
			
			.caed {
				height: 106rpx;
				bottom: 0;
				background-color: #222443;
				border-radius: 8rpx;
				padding-left: 276rpx;
			}
			.item-name {
				font-size: 32rpx;
				font-weight: 400;
			}
					
			.item-mark {
				font-size: 32rpx;
				color: #FF9A23;
			}
					
			.item-intro {
				width: 512rpx;
			}
					
			.item-intro,
			.item-type {
				color: #999;
				font-size: 24rpx;
			}
					
			.item-school {
				color: #0A57D0;
				font-size: 24rpx;
			}
		}

		.item:first-child {
			margin-top: 0 !important;
		}
	}
</style>