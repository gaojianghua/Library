<template>
	<view class="page-warp">
		<m-navbar :borderBottom="false" :bgColor="$store.state.bgColor" i18n value="page.排行榜">
		</m-navbar>
		<u-subsection :list="topTabs" fontSize="14"  activeColor="#fff" bgColor="#333" inactiveColor="#999" :current="current"
			@change="switchTabs"></u-subsection>
		<view class="tab-list px-2 py-2">
			<m-tabs :textStyle="{color: '#96989C'}" :chooseTextStyle="{color: '#fff'}" :itemStyle="itemStyle"
				chooseBgColor="#6F43FE" scrollBgColor="transparent" bgColor="#353A47" :tabs="tabs"
				@changeTab="rankChangeTab" :chooseIndex="rankChooseIndex">
			</m-tabs>
		</view>
		<view class="tab-list px-2 pb-2">
			<m-tabs :textStyle="{color: '#96989C'}" :chooseTextStyle="{color: '#fff'}" :itemStyle="itemStyle"
				chooseBgColor="#6F43FE" scrollBgColor="transparent" bgColor="#353A47" :tabs="$store.state.allType"
				@changeTab="changeTab" :chooseIndex="chooseIndex">
			</m-tabs>
		</view>
		<m-scroll :isLoading="isLoading" i18n :load="load" :scrollStyle="scrollStyle" @loadmore="loadmore"
			bgColor="transparent" @onRefresh="onRefresh">
			<u-empty class="pt-5" v-if="load != 0 && data.length == 0" mode="list" :text="$t('暂无数据')"
				icon="/static/img/common/white-empty.png">
			</u-empty>
			<view v-if="data && data.length != 0" class="list px-3">
				<view class="item position-relative" v-for="(item, i) in data" :key="i" @click="itemClick(item)">
					<view class="position-absolute d-flex top-0 mt-3 index-2" style="left: 0;">
						<view class="rank line-h flex-shrink mr-1"
							:style="{color: i == 0 ? '#F78F1E' : i == 1 ? '#9EB1C4' : i == 2 ? '#FAC4A9' : '#dfdfdf'}">
							{{i+1}}
						</view>
						<view class="position-relative mr-2">
							<u-image radius="6" width="215rpx" height="260rpx" :src="item.picx"></u-image>
							<view v-if="item.is_minors == 1"
								class="position-absolute font line-h top-0 right-0 py-1 px-1"
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
								{{item.state}}
							</view>
							<view class="text-ellipsis2 item-type mt-1" style="width: 425rpx;">
								{{item.text}}
							</view>
						</view>
					</view>
					<view class="caed py-2 pr-3 j-around d-flex position-absolute left-0 w-100 index-1">
						<view class="caed-l flex-shrink j-sb d-flex a-center flex-column">
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
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import MTabs from '@/main_modules/main-ui/m-tabs/index.vue'
	import {
		requestData
	} from '@/utils/index.js'
	import {
		getComicData,
		getNovelData,
		getLeaderboard,
		getNovelLeaderboardType,
		getType
	} from '@/utils/request/api/get.js'
	export default {
		components: {
			MScroll,
			MTabs
		},
		data() {
			return {
				isLoading: true,
				load: 0,
				current: 0,
				tabIndex: 0,
				data: [], // 数据列表
				tabs: [], //人气榜=总榜
				topTabs: [{
						name: this.$t('page.漫画')
					},
					{
						name: this.$t('page.小说')
					}
				],
				query: {
					page: 1,
					size: 20,
					sort: '',
					cid: ''
				},
				multiIndex: 0,
				chooseIndex: 0,
				rankChooseIndex: 0,
				itemStyle: {
					borderRadius: '10rpx',
					marginRight: '28rpx'
				}
			}
		},
		onLoad(options) {
			if (options.item != undefined) {
				this.current = options.item * 1
			}
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.getType()
				this.get_tabs()
			},
			async getType() {
				let result = requestData({})
				let {
					list
				} = await getLeaderboard(result)
				this.tabs = list
				this.getRank()
			},
			async getNovelType() {
				let result = requestData({})
				let {
					list
				} = await getNovelLeaderboardType(result)
				this.tabs = list
				this.getRank()
			},
			async get_tabs() {
				let result = requestData()
				let {
					list
				} = await getType(result)
				list.unshift({
					id: 0,
					name: "全部"
				})
				this.query.cid = list[this.multiIndex].id
				this.$store.commit('updateAllType', list)
				uni.setStorageSync('allType', list)
			},
			itemClick(i) {
				if (this.current == 0) {
					uni.navigateTo({
						url: '/pages-child/comic-detail/index?id=' + i.id
					})
				} else {
					uni.navigateTo({
						url: '/pages-child/novel-detail/index?id=' + i.id
					})
				}
			},
			async getRank(e) {
				this.query.state = 0
				this.query.sort = this.tabs[this.tabIndex].value
				this.query.cid = this.$store.state.allType[this.multiIndex].id
				let result = requestData(this.query)
				let res
				if (this.current == 0) {
					res = await getComicData(result)
				} else {
					res = await getNovelData(result)
				}
				if (res.code == 1) {
					if (e) { // 加载更多
						this.data = this.data.concat(res.list)
					} else {
						this.data = res.list
					}
					if (this.query.page * this.query.size >= res.nums) {
						return this.load = 1
					} else {
						return this.load = 2
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
				}
			},
			// 下拉刷新
			onRefresh() {
				this.query.page = 1
				this.getRank()
			},
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.query.page++
				this.istrig = false
				let time = setTimeout(() => {
					this.getRank('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
			// 切换小说漫画
			switchTabs(i) {
				this.load = 0
				this.current = i
				this.query.page = 1
				this.data = []
				if (i == 1) {
					this.getNovelType()
				} else {
					this.getType()
				}
			},
			// 切换排行榜
			rankChangeTab(i) {
				this.load = 0
				this.query.page = 1
				if (this.tabIndex != i.index) {
					this.tabIndex = i.index
					this.data = []
					this.getRank()
				}
			},
			// 切换分类
			changeTab(e) {
				this.load = 0
				this.multiIndex = e.index
				this.query.page = 1
				this.getRank()
			}
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - ${this.$store.state.navbarHeight}px - 180rpx - 32px - env(safe-area-inset-bottom) - ${this.$store.state.statusHeight}px)`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ .u-subsection--button__bar{
		background-color: #6F43FE;
	}
	.list {
		.item {
			height: 330rpx;
			
			.caed-c {
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
				color: #ED6824;
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