<template>
	<view class="page">
		<m-navbar :borderBottom="false" i18n value="page.会员充值" bgColor="rgba(0,0,0,.5)"></m-navbar>
		<m-scroll :isLoading="false" :scrollStyle="scrollStyle" :isCustomRefresh="false">
			<view class="bg-box d-flex j-center flex-column mx-3 p-3">
				<view class=""></view>
				<view class="d-flex flex-column mt-auto">
					<view class="card-info text-white">
						<u-image width="114rpx" height="114rpx" radius="50"
							src="/static/img/common/avatar.png"></u-image>
						<view class="vipinfo-t mt-2 d-flex a-center">
							<span
								class="text-white">{{$store.state.userinfo.nichen || $store.state.userinfo.name || $t('游客')}}</span>
							<view v-if="$store.state.userinfo.vip=='1'"
								class="vipinfo-level ml-1 d-flex a-center j-center">
								{{$store.state.userinfo.vipname}}
							</view>
						</view>
						<view v-if="$store.state.userinfo.vip=='1'" style="color: #999;">
							{{$store.state.userinfo.viptime}}{{$t('到期')}}
						</view>
						<view v-else class="info-desc" style="color: #999;">
							{{$t('开通会员畅享尊贵特权')}}
						</view>
					</view>
				</view>
			</view>
			<view class="vip-box d-flex a-center flex-column mt-3 p-3 mx-3">
				<view class="box-title d-flex a-center">
					<u-image width="55.66rpx" height="11.31rpx" src="/static/img/mine/icon-left.png"></u-image>
					<view class="box-title-name font-weight mx-2">
						{{$t('会员尊享')}}
					</view>
					<u-image width="55.66rpx" height="11.31rpx" src="/static/img/mine/icon-right.png"></u-image>
				</view>
				<scroll-view scroll-x class="scroll-row mt-5">
					<view class="scroll-row-item box-item position-relative" :class="vipIndex == i ? 'active' : ''"
						v-for="(item, i) in vipList" :key="i" @click="selectVip(item, i)">
						<view class="d-flex j-center">
							<view class="item-top d-flex a-center j-center">
								<view class="d-flex a-end j-center">
									<span class="price font-weight line-h">{{Math.floor(item.rmb)}}</span>
									<span class="syml font-weight line-h">{{$store.state.sybml}}</span>
								</view>
							</view>
						</view>
						<view class="item-bot pb-2 d-flex a-center j-end flex-column position-absolute bottom-0 left-0"
							:style="{background: 'url(/static/img/mine/'+ `${vipIndex == i ? 'vip-active': 'vip-default'}` + '.png)'}">
							<view class="vip-name line-h font-weight">
								{{item.name}}
							</view>
							<view class="vip-desc mt-1 line-h">
								{{$t('尊享会员权益')}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="vip-box d-flex a-center flex-column mt-3 p-3 mx-3">
				<view class="box-title d-flex a-center">
					<u-image width="55.66rpx" height="11.31rpx" src="/static/img/mine/icon-left.png"></u-image>
					<view class="box-title-name font-weight mx-2">
						{{$t('会员权益')}}
					</view>
					<u-image width="55.66rpx" height="11.31rpx" src="/static/img/mine/icon-right.png"></u-image>
				</view>
				<view class="equity d-flex a-center flex-wrap">
					<view class="equity-item mt-5 d-flex a-center j-center" v-for="(item, i) in equityList" :key="i">
						<view class="d-flex a-center j-center flex-column">
							<u-image width="100rpx" height="100rpx" :src="item.icon"></u-image>
							<view class="d-flex a-center j-center flex-column mt-2">
								<view class="equity-name font-weight text-white line-h">
									{{$t(item.name)}}
								</view>
								<view class="equity-desc line-h mt-2">
									{{$t(item.desc)}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</m-scroll>
		<view v-if="vipList.length != 0" class="bot position-fixed bottom-0 left-0 w-100 d-flex a-center j-center">
			<u-button @click="openVIP" class="btons text-white d-flex a-center j-center mt-3 flex-shrink">
				{{$store.state.userinfo.vip=='1' ? $t('续费会员') : $t('开通会员')}}
				{{$store.state.sybml}}{{vipList[vipIndex].rmb}}/{{vipList[vipIndex].name}}
			</u-button>
		</view>
		<m-modal :show="show" i18n title="温馨提示" @cancel="show = false" btnName="去完善"
			@confirm="$tools.Navigate.navigateTo('/pages-child/userinfo/index')">
			<view class="d-flex a-center text-center j-center">
				{{$t('为了保障您的账户安全，请尽快完善您的个人信息 (绑定手机号/邮箱)。')}}
			</view>
		</m-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import MNavbar from '@/main_modules/main-ui/m-navbar/index.vue'
	import MModal from '@/main_modules/main-ui/m-modal/index.vue'
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import {
		requestData
	} from '@/utils/index.js'
	import {
		getVIPData,
		getOpenVIP,
		getUserInfo,
		createOrder,
		googlePayVerify
	} from '@/utils/request/api/get.js'
	import {
		equityList,
	} from './data.js'
	// #ifdef APP-PLUS
	var googlePay = uni.requireNativePlugin("sn-googlepay5");
	// #endif
	export default {
		components: {
			MNavbar,
			MModal,
			MScroll
		},
		data() {
			return {
				show: false,
				vipList: [],
				equityList,
				vipIndex: 0,
				query: {
					day: '',
					rmb: '',
					pay: '',
					type: 'vip'
				},
				req: false,
				verifyQuery: {
					dd: ''
				}
			}
		},
		onLoad() {
			this.init()
		},
		onShow() {
			this.getUserinfo()
		},
		methods: {
			init() {
				this.vipData()
				// #ifdef APP-PLUS
				googlePay.init({}, (e) => {
					console.log('init', e);
					if (e.code == 0) {
						// 初始化成功
					} else {
						// 初始化失败
					}
				});
				// #endif
			},
			async vipData() {
				let result = requestData({})
				let {
					code,
					viplist
				} = await getVIPData(result)
				if (code == 1) {
					this.query.day = viplist[this.vipIndex].day
					this.query.rmb = viplist[this.vipIndex].rmb
					this.vipList = viplist
				}
			},
			async getUserinfo(e) {
				let result = requestData({})
				let {
					user,
					code
				} = await getUserInfo(result)
				if (code == 1) {
					this.$store.commit('updateUserinfo', user)
					uni.setStorageSync('userinfo', user)
					if (e) {
						if (!user.email || !user.mobile) {
							this.show = true
						}
					}
				}
			},
			openDetail(i) {
				uni.navigateTo({
					url: '/pages-child/comic-detail/index?id=' + i
				})
			},
			// 开通VIP
			async openVIP() {
				if (this.req) return
				this.req = true
				this.$refs.uToast.show({
					type: 'loading',
					duration: 15000
				})
				let result = requestData(this.query)
				let {
					code
				} = await getOpenVIP(result)
				if (code == 1) {
					this.generateOrder()
					this.$refs.uToast.hide()
					this.req = false
				}
			},
			// 生成订单
			async generateOrder() {
				let result = requestData(this.query)
				let {
					dd
				} = await createOrder(result)
				this.verifyQuery.dd = dd
				this.googlePurchase()
			},
			// 谷歌内购
			googlePurchase() {
				// #ifdef APP-PLUS
				const adjust = uni.requireNativePlugin("sn-adjust");
				adjust.trackEvent({
					eventToken: "jh1yeg", // 必填, 其余都是可选
					callbackId: "hammer-pay"
				});
				// let facebook = uni.requireNativePlugin("sn-facebook");
				// facebook.logEvent({
				// 		name: "pay", // 必填
				// 	},
				// 	(e) => {
				// 		console.log(e)
				// 	},
				// );
				// #endif
				let pId = this.vipList[this.vipIndex].productId;
				googlePay.querySku({
						inapp: [pId]
					},
					(e) => {
						if (e.code == 0) {
							console.log('querySku', e.list);
							if (e.list.length > 0) {
								var pd = e.list[0];
								googlePay.pay({
										productId: pId // 产品id
									},
									(e) => {
										if (e.code == 0) {
											// 支付成功
											console.log('pay result', e);
											let original = e.data[0].original
											googlePay.consume({
													purchaseToken: original
														.purchaseToken, // 来自支付结果的original.purchaseToken (或 original.token)
												},
												(e) => {
													if (e.code == 0) {
														// 确认成功
														this.verifyQuery = {
															...this.verifyQuery,
															...original
														}
														this.openGooglePayVerify()
													} else {
														// 确认失败
													}
												},
											);
										} else {
											// 支付失败
											// #ifdef APP-PLUS
											const adjust = uni.requireNativePlugin("sn-adjust");
											adjust.trackEvent({
												eventToken: "z46gl0", // 必填, 其余都是可选
												callbackId: "hammer-pay-fail"
											});
											// let facebook = uni.requireNativePlugin("sn-facebook");
											// facebook.logEvent({
											// 		name: "pay-fail", // 必填
											// 	},
											// 	(e) => {
											// 		console.log(e)
											// 	},
											// );
											// #endif
										}
									}
								);
							} else {
								console.log('未查询到产品');
							}
						} else {
							//查询失败
							console.log('querySku fail', e);
						}
					}
				);
			},
			// 谷歌内购支付验证
			async openGooglePayVerify() {
				let result = requestData(this.verifyQuery)
				let {
					code,
					msg
				} = await googlePayVerify(result)
				if (code == 1) {
					this.getUserinfo(true)
				} else {
					uni.showToast({
						title: msg,
						icon: "none",
					});
				}
				// #ifdef APP-PLUS
				const adjust = uni.requireNativePlugin("sn-adjust");
				adjust.trackEvent({
					eventToken: "rconmc", // 必填, 其余都是可选
					callbackId: "hammer-pay-success"
				});
				// let facebook = uni.requireNativePlugin("sn-facebook");
				// facebook.logEvent({
				// 		name: "pay-success", // 必填
				// 	},
				// 	(e) => {
				// 		console.log(e)
				// 	},
				// );
				// #endif
			},
			openMore(i) {
				this.$tools.Navigate.navigateTo('/pages-child/comic-exclusive/index', i)
			},
			selectVip(item, i) {
				this.query.day = item.day
				this.query.rmb = item.rmb
				this.vipIndex = i
			},
			loadmore() {
				return this.isLoading = false
			},
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - 60rpx - 84rpx - env(safe-area-inset-bottom) - ${this.$store.state.statusHeight}px - ${this.$store.state.navbarHeight}px)`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {

		.bg-box {
			height: 350rpx;
			width: 690rpx;
			background: url('/static/img/mine/vip-re-bg.png') no-repeat;
			background-size: cover;

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
		}

		.vip-box {
			background: linear-gradient(225deg, #3D3D3B 0%, #2F2D2D 100%);
			box-shadow: 0rpx 0rpx 16rpx 0rpx rgba(0, 0, 0, 0.2);
			border-radius: 20rpx 20rpx 20rpx 20rpx;
			border: 4rpx solid #96948C;

			.box-title {
				.box-title-name {
					font-size: 40rpx;
					color: #EAD0AE;
				}
			}

			.box-item {
				width: 196rpx;
				height: 284rpx;
				background: linear-gradient(360deg, #1E1F20 0%, #5F687F 100%);
				border-radius: 20rpx 20rpx 20rpx 20rpx;
				margin-right: 18rpx;
				padding-top: 16rpx;

				.item-top {
					width: 164rpx;
					height: 166rpx;

					.price {
						color: #BECAE1;
						font-size: 64rpx;
					}

					.syml {
						color: #BECAE1;
						font-size: 40rpx;
						padding-bottom: 8rpx;
						margin-left: 4rpx;
					}
				}

				.item-bot {
					width: 196rpx;
					height: 114rpx;
					background-repeat: no-repeat !important;
					background-size: 100% 100% !important;

					.vip-name {
						color: #FFFFFF;
						font-size: 26rpx;
					}

					.vip-desc {
						font-size: 22rpx;
						color: #EAD0AE;
					}
				}
			}

			.equity {
				padding: 48rpx 0;

				.equity-item {
					width: 50%;
					.equity-name{
						
					}
					.equity-desc{
						font-size: 24rpx;
						color: #8D8D8D;
					}
				}
				.equity-item:nth-child(1),
				.equity-item:nth-child(2) {
					margin-top: 0 !important;
				}
			}


			.active {
				background: linear-gradient(180deg, #F8DFC1 0%, #E8BA85 100%);

				.item-top {
					background: linear-gradient(180deg, #FCEBD3 0%, #F3CFA7 100%);
					box-shadow: 2rpx -2rpx 4rpx 0rpx #E2C397;
					border-radius: 20rpx 20rpx 0 0;

					.price {
						color: #603B25;
						font-size: 64rpx;
					}

					.syml {
						color: #603B25;
						font-size: 40rpx;
					}
				}

				.item-bot {
					.vip-name {
						color: #603B25;
					}

					.vip-desc {
						color: #C27819;
					}
				}
			}
		}

		.bot {
			background-color: #050B18;
			padding-bottom: calc(30rpx + env(safe-area-inset-bottom));

			.btons {
				font-size: 34rpx;
				border-radius: 50rpx;
				height: 84rpx;
				width: 574rpx;
				margin: 0 auto;
				border: none;
				color: #000;
				background: #6F43FE;
			}

			.btons:active {
				background: #6F43FE80;
			}
		}
	}
</style>