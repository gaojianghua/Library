<template>
	<view class="page">
		<m-navbar :borderBottom="false" bgColor="transparent" :value="value" i18n>
		</m-navbar>
		<view class="p-2">
			<m-tabs :textStyle="{color: '#96989C'}" :chooseTextStyle="{color: '#fff'}" :itemStyle="itemStyle"
				chooseBgColor="#6F43FE" scrollBgColor="transparent" bgColor="#353A47" :tabs="$store.state.allType"
				@changeTab="changeTab" :chooseIndex="chooseIndex">
			</m-tabs>
		</view>
		<view class="px-2">
			<view v-if="isType == `news`" class="tabs d-flex a-center">
				<view v-for="(item, i) in newTimes" :key="i">
					<view class="px-2 pt-2 text-white" style="font-size: 28rpx;" :class="{active:i==newTimes_id}"
						@click="newTimesClick(item, i)">{{$t(item.name)}}</view>
				</view>
			</view>
			<view v-if="isType == 'finish'" class="tabs d-flex a-center">
				<view v-for="(item, i) in completed" :key="i">
					<view class="px-2 pt-2 text-white" style="font-size: 28rpx;" :class="{active:i==newTimes_id}"
						@click="newTimesClick(item, i)">{{$t(item.name)}}</view>
				</view>
			</view>
			<view v-if="isType == 'finish' || isType == 'news'" class="tabs d-flex a-center">
				<view v-for="(item, i) in tags" :key="i">
					<view class="px-2 pt-2 text-white" style="font-size: 28rpx;" :class="{active:i==tags_id}"
						@click="tagsClick(item, i)">{{$t(item.name)}}</view>
				</view>
			</view>
		</view>
		<m-scroll :isLoading="isLoading" i18n :load="load"
			:scrollStyle="{height: 
			`calc(100vh - env(safe-area-inset-bottom) - ${isType != 'recomm' ? '240rpx' : '100rpx'} - ${$store.state.navbarHeight}px - ${$store.state.statusHeight}px)`}" @loadmore="loadmore" bgColor="transparent"
			@onRefresh="onRefresh">
			<view class="list px-2">
				<u-empty class="pt-5" v-if="load != 0 && list.length == 0" mode="list" :text="$t('暂无数据')"
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
								{{item.state}}
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
	import MTabs from '@/main_modules/main-ui/m-tabs/index.vue'
	import {
		newTimes,
		tags,
		completed
	} from './data.js'
	import {
		getNovelData,
		getType
	} from '@/utils/request/api/get.js'
	import {
		requestData
	} from '@/utils/index.js'
	export default {
		components: {
			MScroll,
			MNavbar,
			MTabs
		},
		data() {
			return {
				isLoading: true,
				list: [],
				query: {
					page: 1,
					size: 20,
					cid: 0,
					date_type: 0,
					sort: '',
					tid: 1,
					pay: 0,
					state: ''
				},
				isType: '',
				load: 0,
				istrig: true,
				value: '',
				newTimes,
				tags,
				completed,
				multiIndex: 0,
				chooseIndex: 0,
				itemStyle: {
					borderRadius: '10rpx',
					marginRight: '28rpx'
				},
				newTimes_id: 0,
				tags_id: 0,
				scrollStyle: {}
			}
		},
		onLoad(option) {
			this.isType = this.$tools.Navigate.receivePageData(option)
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.isType == 'recomm' ? this.value = 'page.热门推荐' :
					(this.isType == 'news' ? this.value = '最新作品' : (this.isType == 'finish' ? this.value = '已完结' : this
						.value = '限时免费'))
				if (this.isType == 'free') {
					this.query.pay = 1
				}
				if (this.isType == 'news') {
					this.query.sort = 'addtime'
				}
				if (this.isType == 'finish') {
					this.query.state = 2
				}
				this.get_tabs()
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
				this.$store.commit('updateAllType', list)
				uni.setStorageSync('allType', list)
				this.getBook()
			},
			newTimesClick(item, i) {
				this.newTimes_id = i
				this.query.date_type = item.date_type
				this.query.state = item.state
				this.getBook()
			},
			tagsClick(item, i) {
				this.tags_id = i
				this.query.sort = item.sort
				this.getBook()
			},
			async getBook(e) {
				this.query.cid = this.$store.state.allType[this.multiIndex].id
				let result = requestData(this.query)
				let {
					list,
					nums,
					code
				} = await getNovelData(result)
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
					url: '/pages-child/novel-detail/index?id=' + i.id
				})
			},
			// 切换选项卡
			changeTab(e) {
				this.multiIndex = e.index
				this.getBook()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {

		.tabs {
			height: 70rpx;
			
			.active {
				color: #6F43FE !important;
			}
		}

		.list {
			.item{
				height: 330rpx;
			}
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
			.item:first-child {
				margin-top: 0 !important;
			}
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
</style>