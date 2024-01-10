<template>
	<view class="container">
		<view class="user-section" :style="{height: `calc(358rpx + ${$store.state.statusHeight}px)`}">
			<m-top></m-top>
			<view class="user-info-box d-flex flex-column j-center a-center" @click="$tools.Navigate.navigateTo('/pages-child/userinfo/index')">
				<view class="w-100 position-relative d-flex a-center j-center">
					<u-image radius="50%" width="120rpx" height="120rpx" src="/static/img/common/avatar.png">
					</u-image>
					<view class="position-absolute top-0 right-0" @click.stop="scanCode">
						<u-icon name="scan" size="24" color="#fff"></u-icon>
					</view>
				</view>
				<view class="info-box d-flex a-center j-center flex-column ml-2">
					<view class="d-flex a-center">
						<text
							class="username text-white">{{$store.state.userinfo.nichen || $store.state.userinfo.name || $t('游客')}}</text>
						<view class="vip-box line-h ml-2 px-1" v-if="$store.state.userinfo.vip=='1'" @click.stop="vip">
							{{$store.state.userinfo.vipname}}
						</view>
					</view>
					<view v-if="$store.state.userinfo.vip=='1'" class="mt-1" style="font-size: 28rpx; color: #c2c2c2;">
						{{$store.state.userinfo.viptime}}{{$t('到期')}}
					</view>
				</view>
			</view>
			<view class="vip-content" @click="vip">
				<u-image width="100%" height="120rpx"
					:src="`/static/img/mine/mine-vip.png`"></u-image>
			</view>
		</view>
		<view style="height: 90rpx;"></view>
		<view class="menu w-100 d-flex flex-wrap px-3">
			<view class="list-item mt-2 d-flex flex-column a-center j-center" v-for="(item, i) in menuList" :key="i" @click="menuClick(item)">
				<view class="">
					<u-image width="100rpx" height="100rpx" :src="item.icon"></u-image>
				</view>
				<view class="text-white font">
					{{$t(item.name)}}
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import MCell from '@/main_modules/main-ui/m-cell/index.vue'
	import {
		requestData
	} from '@/utils/index.js'
	// #ifdef APP-PLUS
	import APPUpdate, {
		getCurrentNo
	} from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	// #endif
	import {
		getMyReadData,
		getUserInfo,
		getSystemMessage
	} from '@/utils/request/api/get.js'
	import {
		menuList
	} from './data.js'
	export default {
		components: {
			MCell
		},
		data() {
			return {
				show: false,
				version: 0,
				menuList,
				query: {
					page: 1,
					size: 10
				},
				email: ''
			}
		},
		onLoad() {
			// #ifdef APP-PLUS
			getCurrentNo(res => {
				// 进页面获取当前APP版本号（用于页面显示）
				this.version = res.versionName;
			});
			APPUpdate();
			// #endif
			this.getSyetemInfo()
		},
		onShow() {
			// #ifdef APP-PLUS
			// 获取版本号
			plus.runtime.getProperty(plus.runtime.appid, (inf)=> {
				this.version = inf.version
			});
			// #endif
			this.getUserinfo()
		},
		methods: {
			async getSyetemInfo() {
				let result = requestData({})
				let {
					email,
					code
				} = await getSystemMessage(result)
				this.email = email
			},
			// 跳转VIP充值页面
			vip() {
				uni.navigateTo({
					url: '/pages-child/member-recharge/index'
				})
			},
			// 扫码
			scanCode() {
				uni.scanCode({
					success: (res) => {
						let startIndex = res.result.indexOf("/pages/"); // 获取 "/pages/" 的起始下标
						let result = res.result.substring(startIndex);
						console.log(result)
						uni.navigateTo({
							url: result
						})
					}
				})
			},
			async getUserinfo() {
				let result = requestData({})
				let {
					user
				} = await getUserInfo(result)
				this.$store.commit('updateUserinfo', user)
				uni.setStorageSync('userinfo', user)
			},
			menuClick(item) {
				switch (item.id) {
					case 1:
						this.$tools.Navigate.navigateTo("/pages-child/my-bookshelf/index")
						break;
					case 2:
						this.$tools.Navigate.navigateTo("/pages-child/history/index")
						break;
					case 3:
						this.$tools.Navigate.navigateTo("/pages-child/about-us/index")
						break;
					case 4:
						this.$tools.Navigate.navigateTo("/pages-child/feedback/index")
						break;
					case 5:
						APPUpdate(true);
						break;
				}
			}
		}
	}
</script>
<style lang='scss' scoped>
	.user-section {
		padding: 30rpx 30rpx 0;
		position: relative;
		background: url('/static/img/mine/mine-bg.png') no-repeat;
		background-size: 100% 100%;

		.vip-content {
			z-index: 8;
			position: absolute;
			left: 30rpx;
			bottom: -60rpx;
			height: 120rpx;
			width: calc(100% - 60rpx);

			.vip-card-box {
				display: flex;
				flex-direction: column;
				color: #f7d680;
				height: 240upx;
				background: #111;
				border-radius: 16rpx;
				overflow: hidden;
				position: relative;
				padding: 20upx 24upx;

				.card-bg {
					position: absolute;
					top: 20upx;
					right: 0;
					width: 380upx;
					height: 260upx;
				}

				.b-btn {
					position: absolute;
					right: 30rpx;
					top: 30rpx;
					width: 138upx;
					height: 50upx;
					font-size: 22upx;
					color: #36343c;
					border-radius: 20rpx;
					background: linear-gradient(to left top, #f9e6af, #ffd465);
					z-index: 1;
				}

				.tit {
					font-size: 30rpx;
					color: #f7d680;
					margin-bottom: 20rpx;
					display: flex;

					.yticon {
						color: #f6e5a3;
						margin-right: 16upx;
						margin-top: auto;
						margin-bottom: auto;
					}
				}

				.e-b {
					font-size: 24upx;
					color: #d8cba9;
					margin-top: 10upx;
				}
			}
		}
	}

	.user-info-box {
		position: relative;
		z-index: 1;

		.username {
			font-size: 36rpx;
			color: #303133;
		}

		.vip-box {
			border-radius: 4rpx;
			padding: 6rpx 12rpx;
			font-size: 22rpx;
			color: #74300B;
			background: linear-gradient(90deg, #FDEDCC 0%, #FCCC8C 52%, #F2A82B 100%);
			border: 4rpx solid #FFCA95;
		}
		
		.info-box{
			height: 130rpx;
		}

	}

	.menu {
		.list-item{
			width: 25%;
		}
	}
</style>