<template>
	<u-transition :show="show" mode="slide-down">
		<view :style="{height: `${dropDown}px`, top: `-${dropDown}px`}"
			class="w-100 refresher text-center d-flex a-center j-center">
			<u-loading-icon v-if="isLoad" size="20" :inactiveColor="mainColor + '22'" :color="mainColor">
			</u-loading-icon>
			<view :style="{color: mainColor}" class="refresher-text ml-2">
				{{text}}
			</view>
		</view>
	</u-transition>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: () => {
					return false
				}
			},
			mainColor: {
				type: String,
				default: () => {
					return '#151521'
				}
			},
			dropDown: {
				type: [String, Number],
				default: () => {
					return 45
				}
			},
			text: {
				type: String,
				default: () => {
					return ''
				}
			},
			isLoad: {
				type: Boolean,
				default: () => {
					return false
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.refresher {
		position: absolute;
		left: 0;
		transform: all 0.3s linear;

		.refresher-text {
			font-size: 26rpx;
			font-family: PingFang SC;
			font-weight: 500;
		}
	}
</style>
