<!-- 上拉加载组件 -->
<template>
	<view v-if="show" class="loading d-flex j-center a-center" :style="{'height': `${height}rpx`}">
		<view v-if="load == 2" class="loading-text d-flex j-center a-center" :style="'color:' + mainColor + ';'">
			<!-- <view class="logo flex justify-center align-center">
				<image lazy-load :src="entLogo" mode=""></image>
			</view> -->
			<text class="logo-text">{{$t('上拉即可加载更多')}}</text>
		</view>
		<view v-if="load == 0" class="loading-text d-flex j-center a-center" :style="'color:' + mainColor + ';'">
			<u-loading-icon size="20" :inactiveColor="mainColor + '22'" :color="mainColor"></u-loading-icon>
			<text class="logo-text ml-2">{{$t('努力加载中。。。')}}</text>
		</view>
		<view v-if="load == 1" class="loading-text d-flex j-center a-center" :style="'color:' + mainColor + ';'">
			<!-- <view class="logo flex justify-center align-center">
				<image lazy-load :src="entLogo" mode=""></image>
			</view> -->
			<text class="logo-text">{{$t('已经到底了哦!')}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "loading",
		props: {
			show: {
				type: Boolean,
				default: () => {
					return true
				}
			},
			load: {
				type: [String, Number],
				default: () => {
					return 2
				}
			},
			mainColor: {
				type: String,
				default: () => {
					return '#7E55FF'
				}
			},
			height: {
				type: [String, Number],
				default: () => {
					return 50
				}
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.loading {
		//height: 50rpx;

		.loading-text {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;

			.logo {
				width: 40rpx;
				height: 40rpx;
			}
		}
	}
</style>
