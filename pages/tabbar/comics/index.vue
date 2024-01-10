<template>
	<view class="page">
		<m-navbar :borderBottom="false" bgColor="transparent" isTab isSlot>
			<view class="w-100 d-flex a-center search px-2 position-relative">
				<view class="position-absolute top-0 right-0 left-0 bottom-0 index-5" @click="search()">
				</view>
				<!-- 搜索框 -->
				<u-search bgColor="rgba(255,255,255,0.2)" :placeholder="$t('请输入关键词')" height="60rpx" disabled
					:showAction="false"></u-search>
			</view>
		</m-navbar>
		<!-- 列表栏 -->
		<m-scroll :isLoading="isLoading" i18n :load="load" :scrollStyle="scrollStyle" @loadmore="loadmore"
			bgColor="transparent" @onRefresh="onRefresh">
			<view class="py-4">
				<u-swiper bgColor="transparent" previousMargin="100rpx" nextMargin="100rpx" :list="swiperList"
					keyName="html" circular :loading="swiperLoading" @click="swiperClick" radius="6" height="312rpx"
					imgMode="aspectFill"></u-swiper>
			</view>
			<view class="d-flex a-center">
				<view style="width: 25%;" class="d-flex a-center j-center flex-column" v-for="(item, i) in gridList" :key="i"
				@click="grid_click(i)">
					<u-image width="80rpx" height="80rpx" :src="item.icon"></u-image>
					<view class="text-white mt-1">{{item.name}}</view>
				</view>
			</view>
			<view class="px-2 mt-3">
				<view class="d-flex a-center j-sb">
					<text style="font-weight: 500;color: #fff;font-size: 32rpx;">{{$t('page.热门推荐')}}</text>
					<u-icon :label="$t('更多')" labelPos="left" labelSize="26rpx" name="arrow-right"
						@click="$u.route('/pages-child/comic-hold/index')"></u-icon>
				</view>
				<view class="list d-flex flex-wrap j-sb">
					<view v-for="(item, i) in holdList" :key="i" class="list-item d-flex flex-column mt-2"
						@click="get_detail(item.id)">
						<view class="position-relative">
							<u-image width="100%" height="212rpx" radius="5" :src="item.picx" :lazy-load="true">
								<view slot="error" style="font-size: 24rpx;">{{$t('加载失败')}}</view>
							</u-image>
							<view v-if="item.is_minors == 1"
								class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
								style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
								18
							</view>
						</view>
						<u-text size="28rpx" color="#fff" :lines="1" :text="item.name" margin="5rpx 0 0 0"></u-text>
						<u-text size="24rpx" :lines="2" lineHeight="32rpx" class="initial" :text="item.text"
							margin="0 0 10rpx 0" color="#616161"></u-text>
					</view>
				</view>
			</view>
			<view class="px-2">
				<view class="d-flex a-center j-sb mt-3">
					<text style="font-weight: 500;color: #fff;font-size: 32rpx;">{{$t('page.潜力新作')}}</text>
					<u-icon label="更多" labelPos="left" labelSize="24rpx" name="arrow-right"
						@click="chakangengduo()"></u-icon>
				</view>
				<view v-if="newList[0]" @click="get_detail(newList[0].id)" class="news position-relative mt-3">
					<view class="position-absolute d-flex top-0 index-2" style="left: 30rpx;">
						<view class="position-relative flex-shrink mr-2">
							<u-image radius="6" width="215rpx" height="260rpx" :src="newList[0].picx"></u-image>
							<view v-if="newList[0].is_minors == 1"
								class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
								style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
								18
							</view>
						</view>
						<view class="d-flex flex-1 flex-column">
							<view class="d-flex a-center mt-1">
								<view class="item-name text-white line-h text-ellipsis1">
									{{newList[0].name}}
								</view>
							</view>
							<view class="item-school mt-1">
								{{newList[0].type_name}} · {{newList[0].state}}
							</view>
							<view class="text-ellipsis2 item-type mt-1" style="width: 425rpx;">
								{{newList[0].text}}
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
									{{newList[0].score}}{{$t('分')}}
								</view>
							</view>
						</view>
						<view class="caed-c mx-3"></view>
						<view class="caed-r d-flex a-center j-sb flex-column">
							<view class="line-h font" style="color: #77799A;">
								{{$t('作者')}}
							</view>
							<view class="text-white text-center auto-feed-letter font line-h">
								{{newList[0].author}}
							</view>
						</view>
					</view>
				</view>
				<view class="list d-flex flex-wrap j-sb">
					<view v-for="(item,index) in newList.slice(1, 5)" :key="index"
						class="list-item d-flex flex-column mt-2" @click="get_detail(item.id)">
						<view class="position-relative">
							<u-image width="100%" height="212rpx" radius="5" :src="item.pic" :lazy-load="true">
								<view slot="error" style="font-size: 24rpx;">{{$t('加载失败')}}</view>
							</u-image>
							<view v-if="item.is_minors == 1"
								class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
								style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
								18
							</view>
						</view>
						<u-text size="28rpx" color="#fff" :lines="1" :text="item.name" margin="5rpx 0 0 0"></u-text>
						<u-text size="24rpx" :lines="2" lineHeight="32rpx" class="initial" :text="item.text"
							margin="0 0 10rpx 0" color="#616161"></u-text>
					</view>
				</view>
			</view>
			<view class="px-2 mt-3">
				<text style="font-weight: 500;color: #fff;font-size: 18px;">{{$t('猜你喜欢')}}</text>
				<view class="lists d-flex flex-column">
					<view v-for="(item,index) in loveList" :key="index" class="loves position-relative"
						@click="get_detail(item.id)">
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
			</view>
		</m-scroll>
	</view>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	// #ifdef APP-PLUS
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	import MNavbar from '@/main_modules/main-ui/m-navbar/index.vue'
	import {
		login,
		getUserInfo,
		getHomeRecomm,
		getComicData,
		getBanner
	} from '@/utils/request/api/get.js'
	import {
		getIPCitys,
		requestData
	} from '@/utils/index.js'
	export default {
		components: {
			MNavbar,
			MScroll
		},
		data() {
			return {
				current: 0,
				isLoading: true,
				swiperList: [],
				swiperLoading: true,
				gridList: [{
						icon: '/static/img/home/menu1.png',
						name: this.$t('排行榜')
					},
					{
						icon: '/static/img/home/menu2.png',
						name: this.$t('会员中心')
					},
					{
						icon: '/static/img/home/menu3.png',
						name: this.$t('最新作品')
					},
					{
						icon: '/static/img/home/menu4.png',
						name: this.$t('已完结')
					},
				],
				holdList: [],
				newList: [],
				loveList: [],
				query: {
					reco_size: 7
				},
				holdQuery: {
					page: 1,
					size: 8,
					sort: 'zhits'
				},
				newQuery: {
					page: 1,
					size: 5,
					cid: 0,
					pay: 0,
					sort: 'addtime',
					state: 0
				},
				loveQuery: {
					cid: 0,
					page: 1,
					size: 20,
					pay: 0,
					sort: 'hit',
					state: 0
				},
				load: 0,
				istrig: true
			}
		},
		onLoad() {
			this.login()
			// this.init()
			getIPCitys()
			// #ifdef APP
			APPUpdate();
			// #endif
		},
		methods: {
			// 初始化
			init() {
				this.getNewList()
				this.getLoveList()
				this.getHoldList()
				this.getBannerList()
			},
			// 获取轮播图
			async getBannerList() {
				let result = requestData({
					type: 'index'
				})
				let { data, code} = await getBanner(result)
				if (code == 0) {
					this.swiperLoading = false
					this.swiperList = data
				}
			},
			// banner点击事件
			swiperClick(e) {
				if (this.swiperList[e].interior == 1 && this.swiperList[e].url) {
					// #ifdef APP-PLUS
					plus.runtime.openURL(this.swiperList[e].url)
					// #endif
					// #ifdef H5
					location.href = this.swiperList[e].url
					// #endif
				} else if (this.swiperList[e].interior == 0 && this.swiperList[e].url) {
					uni.navigateTo({
						url: this.swiperList[e].url
					})
				}
			},
			// 获取热门推荐
			async getHoldList() {
				let result = requestData(this.holdQuery)
				let {
					list,
					code
				} = await getComicData(result)
				if (code == 1) {
					this.holdList = list
				}
			},
			// 获取潜力新作
			async getNewList() {
				let result = requestData(this.newQuery)
				let {
					list,
					code
				} = await getComicData(result)
				if (code == 1) {
					this.newList = list
				}
			},
			// 猜你喜欢
			async getLoveList(e) {
				let result = requestData(this.loveQuery)
				let {
					list,
					nums,
					code
				} = await getComicData(result)
				if (code == 1) {
					if (e) { // 加载更多
						this.loveList = this.loveList.concat(list)
					} else {
						this.loveList = list
					}
					if (this.loveQuery.page * this.loveQuery.size >= nums) {
						return this.load = 1
					} else {
						return this.load = 2
					}
				}
			},
			// 下拉刷新
			onRefresh() {
				this.loveQuery.page = 1
				this.newQuery.page = 1
				this.holdQuery.page = 1
				this.init()
			},
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.loveQuery.page++
				this.istrig = false
				let time = setTimeout(() => {
					this.getLoveList('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
			get_detail(id) {
				uni.navigateTo({
					url: '/pages-child/comic-detail/index?id=' + id
				})
			},
			chakangengduo() {
				uni.navigateTo({
					url: '/pages-child/comic-news/index'
				})
			},
			grid_click(i) {
				switch (i) {
					case 0:
						uni.navigateTo({
							url: '/pages-child/ranking/index'
						})
						break;
					case 1:
						uni.navigateTo({
							url: '/pages-child/member-center/index?id=' + '1'
						})
						break;
					case 2:
						uni.navigateTo({
							url: '/pages-child/comic-news/index'
						})
						break;
					case 3:
						uni.navigateTo({
							url: '/pages-child/comic-finished/index'
						})
						break;
					default:
						break;
				}
			},
			search() {
				this.$tools.Navigate.navigateTo('/pages-child/search/index', 1)
			},
			// 登录
			login() {
				const adjust = uni.requireNativePlugin("sn-adjust");
				adjust.getGoogleAdId(async (adid) => {
					uni.setStorageSync('deviceId', adid)
					this.$store.commit('updateDeviceId', adid)
					let minorskey = ''
					await uni.getClipboardData({
						success: (e) => {
							minorskey = e
						}
					})
					let param = {
						email: adid,
						minorskey
					}
					let result = requestData(minorskey ? param : {email: adid})
					let {
						code,
						token,
						uid
					} = await login(result)
					if (code == 1) {
						getApp().globalData.uid = uid
						getApp().globalData.utoken = token
						uni.setStorageSync('token', token)
						this.$store.commit('updateToken', token)
						let userinfo = {
							id: uid
						}
						uni.setStorageSync('userinfo', userinfo)
						this.$store.commit('updateUserinfo', userinfo)
						// #ifdef APP-PLUS
						adjust.trackEvent({
							eventToken: "t8uxye", // 必填, 其余都是可选
							callbackId: "hammer-register"
						});
						adjust.trackEvent({
							eventToken: "ezzxkt", // 必填, 其余都是可选
							callbackId: "hammer-login"
						});
						// let facebook = uni.requireNativePlugin("sn-facebook");
						// facebook.logEvent({
						// 		name: "login", // 必填
						// 	},
						// 	(e) => {
						// 		console.log(e)
						// 	},
						// );
						// #endif
						this.getUserInfo()
						this.init()
					}
				});
			},
			async getUserInfo() {
				let result = requestData({})
				let {
					user
				} = await getUserInfo(result)
				this.$store.commit('updateUserinfo', user)
				uni.setStorageSync('userinfo', user)
				
			}
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - ${this.$store.state.navbarHeight}px - env(safe-area-inset-bottom) - ${this.$store.state.tabbarHeight}px - ${this.$store.state.statusHeight}px)`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background: url('/static/img/home/homebg.png') no-repeat;
		background-size: 100% auto;

		/deep/ .u-search__content__input {
			background-color: transparent !important;
		}

		.list {
			.list-item {
				width: 23.5%;
				margin-right: 2%;
			}

			.list-item:nth-child(4n) {
				margin-right: 0;
			}
		}
	}
	.news{
		height: 300rpx;
	}
	
	.loves{
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
</style>