<!-- 顶部组件 -->
<template>
	<view class="index-5" :class="isSticky? 'position-sticky' : 'position-fixed'">
		<view :style="{height: `${statusHeight}px`, backgroundColor: bgColor}"></view>
		<view class="top top-0 index-1"
			:style="{height: `${navbarHeight}px`, borderBottom: borderBottom ? '1rpx solid #f5f5f5' : 'none'}">
			<view :style="{backgroundColor: bgColor}" class="tabbar d-flex j-center a-center position-relative">
				<view v-if="!isTab" class="tabbar-back d-flex j-center a-center p-1" @click.stop="unBack ? onBack() : retreat()">
					<!-- <u-image height="60rpx" width="60rpx" src="/static/img/common/back.svg"></u-image> -->
					<u-icon name="arrow-left" :color="iconColor" size="20"></u-icon>
				</view>
				<template v-if="isSlot">
					<slot></slot>
				</template>
				<template v-else>
					<view class="tabbar-title" :style="{color: textColor}">
						{{i18n ? $t(value) : value}}
					</view>
				</template>
				<view v-if="isLang" class="tabbar-locale d-flex j-center a-center p-1" @click="selectLang">
					<u-image height="60rpx" width="60rpx" src="/static/img/home/lang.png"></u-image>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	import tools from '../../tools/index.js'
	export default {
		name: "m-navbar",
		props: {
			value: {
				type: String,
				default: ''
			},
			isLang: {
				type: Boolean,
				default: false
			},
			isSlot: {
				type: Boolean,
				default: false
			},
			borderBottom: {
				type: Boolean,
				default: true
			},
			isTab: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: '#fff'
			},
			iconColor: {
				type: String,
				default: '#fff'
			},
			textColor: {
				type: String,
				default: '#fff'
			},
			i18n: {
				type: Boolean,
				default: false
			},
			isSticky: {
				type: Boolean,
				default: true
			},
			unBack: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				statusHeight: 0,
				navbarHeight: 0
			};
		},
		created() {
			this.statusHeight = this.$store.state.statusHeight
			this.navbarHeight = this.$store.state.navbarHeight
		},
		methods: {
			selectLang() {
				this.$emit('selectLang')
			},
			onBack() {
				this.$emit('pageBack')
			},
			retreat() {
				// #ifdef H5
				let pages = getCurrentPages();
				if (pages.length > 1) {
					// 存在上级页面
					tools.Navigate.navigateBack()
				} else {
					// 不存在上级页面
					tools.Navigate.switchTab(this.$router.options.routes[0].alias)
				}
				// #endif
				// #ifndef H5
				tools.Navigate.navigateBack()
				// #endif
				this.$emit('pageBack')
			}
		}
	}
</script>

<style lang="scss">
	.top {
		width: 100vw;
		// border-radius: 8rpx;
		overflow: hidden;

		.tabbar {
			height: 100%;
			width: 100%;

			.tabbar-title {
				font-size: 28rpx;
				font-weight: 500;
			}

			.tabbar-locale {
				position: absolute;
				right: 30rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 60rpx;
				height: 60rpx;

				img {
					width: 60rpx;
				}
			}

			.tabbar-back {
				position: absolute;
				left: 15rpx;
				top: 50%;
				transform: translateY(-50%);

				img {
					width: 60rpx;
				}
			}
		}
	}
</style>