<template>
	<view class="menu-item d-flex j-sb a-center" :style="{borderTop: `2rpx solid ${bbColor}`}">
		<view class="menu-item-left d-flex a-center">
			<u-image class="mr-2" v-if="item.icon" v-bind="$attrs" :radius="radius" :src="item.icon" :width="imgWidth"
				:height="imgHeight" :mode="mode"></u-image>
			<span v-if="item[keyName]" :style="{color}">{{i18n ? $t(item[keyName]) : item[keyName]}}</span>
		</view>
		<view class="menu-item-right d-flex a-center">
			<slot />
			<u-icon v-if="isIcon" name="arrow-right" color="#999" size="14"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		name: "menu-item",
		props: {
			item: {
				type: Object,
				default: () => {
					return {}
				}
			},
			imgWidth: {
				type: String,
				default: () => {
					return '41rpx'
				}
			},
			imgHeight: {
				type: String,
				default: () => {
					return '41rpx'
				}
			},
			mode: {
				type: String,
				default: () => {
					return 'aspectFit'
				}
			},
			keyName: {
				type: String,
				default: () => {
					return 'name'
				}
			},
			isIcon: {
				type: Boolean,
				default: () => {
					return true
				}
			},
			i18n: {
				type: Boolean,
				default: () => {
					return false
				}
			},
			radius: {
				type: [String, Number],
				default: () => {
					return 2
				}
			},
			color: {
				type: String,
				default: () => {
					return '#999'
				}
			},
			bbColor: {
				type: String,
				default: () => {
					return '#111'
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
	.menu-item {
		min-height: 100rpx;
		border-top: 2rpx solid #ccc;

		span {
			font-size: 30rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
		}
	}
</style>
