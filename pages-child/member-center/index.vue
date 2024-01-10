<template>
	<view class="page">
		<m-scroll :isLoading="false" :scrollStyle="scrollStyle" :isCustomRefresh="false">
			<m-navbar :isSticky="false" :borderBottom="false" i18n value="page.会员中心" bgColor="#00000090"></m-navbar>
			<view :style="{height: `calc(${$store.state.navbarHeight}px + ${$store.state.statusHeight}px)`}"></view>
			<view class="pt-3 pb-1">
				<u-swiper bgColor="transparent" previousMargin="100rpx" nextMargin="100rpx" :list="swiperList"
					keyName="html" circular :loading="swiperLoading" @click="swiperClick" radius="6" height="312rpx"
					imgMode="aspectFill"></u-swiper>
			</view>
			<view class="card p-3">
				<view class="vip px-3 py-2 d-flex a-center" @click="openVIP">
					<u-image radius="50" width="84rpx" height="84rpx" src="/static/img/common/avatar.png"></u-image>
					<view class="vipinfo d-flex flex-column j-around ml-2">
						<view class="vipinfo-t d-flex a-center">
							<span>{{$store.state.userinfo.nichen || $store.state.userinfo.name || $t('游客')}}</span>
							<view v-if="$store.state.userinfo.vip=='1'"
								class="vipinfo-level ml-1 d-flex a-center j-center">
								{{$store.state.userinfo.vipname}}
							</view>
						</view>
						<view v-if="$store.state.userinfo.vip=='1'" class="vipinfo-b">
							{{$store.state.userinfo.viptime}}{{$t('到期')}}
						</view>
						<view v-else class="vipinfo-b">
							{{$t('开通会员可尊享更优质的阅读体验！')}}
						</view>
					</view>
					<view class="vipbtn ml-auto d-flex a-center j-center">
						{{$store.state.userinfo.vip=='1' ? $t('续费会员') : $t('开通会员')}}
					</view>
				</view>
				<view class="see mt-3">
					<view class="see-t d-flex a-center">
						<view class="see-t-l d-flex flex-column">
							<span class="see-title text-white">{{$t('超前阅读')}}</span>
						</view>
						<view class="see-t-r ml-auto">
							<span class="more d-flex a-center" @click="openMore(3)">{{$t('更多')}} <u-icon
									name="arrow-right" size="16"></u-icon></span>
						</view>
					</view>
					<view class="see-list d-flex j-sb flex-wrap">
						<view class="lists-item mt-2 d-flex flex-column" v-for="(item, i) in freelist" :key="i"
							@click="openDetail(item.id)">
							<view class="position-relative">
								<u-image width="100%" height="284rpx" radius="4" :src="item.pic" lazy-load></u-image>
								<view v-if="item.is_minors == 1"
									class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
									style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
									18
								</view>
							</view>
							<view class="item-info mt-1">
								<text class="item-title text-white text-ellipsis1">{{ item.name }}</text>
								<view class="item-state line-h text-ellipsis1 mt-1">
									{{item.author}}
								</view>
								<view class="item-desc text-ellipsis2 mt-1">
									{{item.text}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="exclusive py-3">
				<view class="see">
					<view class="see-t pl-3">
						<view class="see-t-l d-flex flex-column">
							<span class="see-title text-white">{{$t('会员尊享')}}</span>
						</view>
					</view>
					<view class="exclusive-list mt-3">
						<swiper :current="current" class="swiper" circular previousMargin="229rpx" nextMargin="229rpx"
							@change="swiperChange">
							<swiper-item class="uni-swiper-item" v-for="(item, i) in viplist" :key="i"
								@click="openDetail(item.id)">
								<view class="exclusive-item d-flex flex-column">
									<view class="item-img" :class="{ 'active': current === i }">
										<image class="img" :src="item.picx"></u-image>
											<view class="exclusive-vip d-flex a-center j-center">
												{{$t('会员尊享')}}
											</view>
											<view class="info d-flex flex-column">
												<view class="item-freename line-h initial text-ellipsis1">
													{{item.name}}
												</view>
												<view class="item-type line-h mt-1">
													{{item.author}} · {{item.state}}
												</view>
											</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			<view class="card py-2 px-3">
				<view class="see">
					<view class="see-t d-flex a-center">
						<view class="see-t-l d-flex flex-column">
							<span class="see-title text-white">{{$t('会员完结')}}</span>
						</view>
						<view class="see-t-r ml-auto">
							<span class="more d-flex a-center" @click="openMore(4)">{{$t('更多')}} <u-icon
									name="arrow-right" size="16"></u-icon></span>
						</view>
					</view>
					<view class="see-list d-flex j-sb flex-wrap">
						<view class="lists-item mt-2 d-flex flex-column" v-for="(item, i) in completed" :key="i"
							@click="openDetail(item.id)">
							<view class="position-relative">
								<u-image width="100%" height="284rpx" radius="4" :src="item.pic" lazy-load></u-image>
								<view v-if="item.is_minors == 1"
									class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
									style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
									18
								</view>
							</view>
							<view class="item-info mt-1">
								<text class="item-title text-white text-ellipsis1">{{ item.name }}</text>
								<view class="item-state line-h text-ellipsis1 mt-1">
									{{item.author}}
								</view>
								<view class="item-desc text-ellipsis2 mt-1">
									{{item.text}}
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
	import MNavbar from '@/main_modules/main-ui/m-navbar/index.vue'
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import {
		requestData
	} from '@/utils/index.js'
	import {
		getComicData,
		getNovelData,
		getBanner
	} from '@/utils/request/api/get.js'
	export default {
		components: {
			MNavbar,
			MScroll
		},
		data() {
			return {
				swiperList: [],
				freelist: [],
				completed: [],
				viplist: [],
				current: 0,
				load: 0,
				istrig: true,
				isLoading: true,
				swiperLoading: true,
				pageId: 1
			}
		},
		onLoad(options) {
			this.pageId = options.id
			console.log(options.id)
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.loading = false
				this.getFreelist()
				this.getCompletedlist()
				this.getViplist()
				this.getBannerList()
			},
			async getFreelist() {
				let result = requestData({
					pay: '3',
					state: '1',
					sort: 'addtime'
				})
				let res
				if (this.pageId == 1) {
					res = await getComicData(result)
				} else {
					res = await getNovelData(result)
				}
				if (res.code == 1) {
					this.freelist = res.list
				}
			},
			async getViplist() {
				let result = requestData({
					pay: '3'
				})
				let res
				if (this.pageId == 1) {
					res = await getComicData(result)
				} else {
					res = await getNovelData(result)
				}
				if (res.code == 1) {
					this.viplist = res.list
				}
			},
			async getCompletedlist() {
				let result = requestData({
					pay: '3',
					state: '2',
					sort: 'addtime'
				})
				let res
				if (this.pageId == 1) {
					res = await getComicData(result)
				} else {
					res = await getNovelData(result)
				}
				if (res.code == 1) {
					this.completed = res.list
				}
			},
			// 获取轮播图
			async getBannerList() {
				let result = requestData({
					type: this.pageId == 1 ? 'vip' : 'bookvip'
				})
				let res
				if (this.pageId == 1) {
					res = await getBanner(result)
				} else {
					res = await getBanner(result)
				}
				if (res.code == 0) {
					this.swiperLoading = false
					this.swiperList = res.data
				}
			},
			openDetail(i) {
				if (this.pageId == 1) {
					uni.navigateTo({
						url: '/pages-child/comic-detail/index?id=' + i
					})
				}else {
					uni.navigateTo({
						url: '/pages-child/novel-detail/index?id=' + i
					})
				}
			},
			openVIP() {
				this.$tools.Navigate.navigateTo('/pages-child/member-recharge/index')
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
			swiperChange(e) {
				this.current = e.detail.current
			},
			openMore(i) {
				let obj = {
					pageId: this.pageId,
					typeId: i
				}
				this.$tools.Navigate.navigateTo('/pages-child/comic-exclusive/index', obj)
			}
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - env(safe-area-inset-bottom))`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background: url('/static/img/mine/vip-center-bg.png') no-repeat;
		background-size: 100% auto;

		.card,
		.exclusive {
			// background-color: #fff;

			.vip {
				background: url('/static/img/mine/vip-center-card.png') no-repeat;
				background-size: cover;
				border-radius: 12rpx;

				.vipinfo {
					.vipinfo-t {
						span {
							color: #333;
							font-weight: 500;
						}

						.vipinfo-level {
							background: linear-gradient(90deg, #FDEDCC 0%, #FCCC8C 52%, #F2A82B 100%);
							height: 40rpx;
							width: 92rpx;
							border-radius: 8rpx;
							font-size: 20rpx;
							color: #74300B;
							border: 4rpx solid #FFCA95;
						}
					}

					.vipinfo-b {
						font-size: 22rpx;
					}
				}

				.vipbtn {
					background: linear-gradient(90deg, #7448FF 0%, #4C17FD 100%);
					height: 46rpx;
					width: 118rpx;
					color: #fff;
					border-radius: 8rpx;
				}
			}

			.see {
				.see-t {
					.see-t-l {
						.see-title {
							font-size: 34rpx;
							color: #AFAFAF;
						}

						.see-desc {
							font-size: 22rpx;
							color: #c2c2c2;
						}
					}

					.more {
						font-size: 28rpx;
						color: #999;
					}
				}

				.see-list {
					.lists-item {
						width: 32%;
						margin-right: 2%;

						.item-info {
							.item-title {
								font-size: 28rpx;
								font-weight: 500;
								color: #333;
							}

							.item-state {
								color: #6F43FE;
								font-size: 26rpx;
							}

							.item-desc {
								font-size: 24rpx;
								color: #ddd;
							}
						}

					}

					.lists-item:nth-child(3n) {
						margin-right: 0 !important;
					}
				}
			}
		}

		.exclusive {
			background: url('/static/img/mine/user-vip-bg.png') no-repeat;
			background-size: cover;

			.see {
				.exclusive-list {
					.swiper {
						height: 358rpx;

						.uni-swiper-item {
							display: flex;
							justify-content: center;
							align-items: center;


							.exclusive-item {
								// margin: 0 10rpx;
								width: 268rpx;
								height: 358rpx;
								// background-color: #ededed;

								.item-img {
									position: relative;
									border-radius: 10rpx;
									overflow: hidden;
									transform: scale(0.8);
									transition: all 0.3s linear;

									.img {
										width: 268rpx;
										height: 358rpx;
										border-radius: 10rpx;
									}

									.exclusive-vip {
										position: absolute;
										top: 12rpx;
										right: 12rpx;
										line-height: 1;
										border-radius: 4rpx;
										padding: 8rpx 12rpx;
										font-size: 22rpx;
										color: #74300B;
										background: linear-gradient(90deg, #FDEDCC 0%, #FCCC8C 52%, #F2A82B 100%);
									}

									.info {
										width: 100%;
										padding: 16rpx;
										position: absolute;
										left: 0;
										bottom: 0;
										background: rgba(0, 0, 0, 0.75);

										.item-freename {
											font-size: 28rpx;
											color: #fff;
										}

										.item-type {
											font-size: 24rpx;
											color: #6F43FE;
										}
									}
								}

								.active {
									transform: scale(1);
									transition: all 0.3s linear;
								}
							}
						}
					}
				}
			}

		}
	}
</style>