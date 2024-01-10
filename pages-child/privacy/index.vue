<template>
	<view class="privacy">
		<m-navbar :borderBottom="false" :value="value" i18n :bgColor="$store.state.bgColor">
		</m-navbar>
		<m-scroll :isLoading="false" :scrollStyle="scrollStyle" :isCustomRefresh="false">
			<template v-if="!privacy">
				<view class="load d-flex a-center j-center">
					<u-loading-icon></u-loading-icon>
				</view>
			</template>
			<view v-else class="main" v-html="privacy"></view>
		</m-scroll>
	</view>
</template>

<script>
	// import { requestData } from '@/utils/index.js'
	// import { getAgreePolicy } from '@/utils/request/api/get.js'
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import { 	policy,
	agreement } from './data.js'
	export default {
		name: "privacy",
		components: {
			MScroll
		},
		data() {
			return {
				privacy:'',
				query: {
					type: ''
				},
				value: ''
			}
		},
		onLoad(option) {
			option.item == 1 ? this.query.type = 'agreement' : this.query.type = 'privacy'
			option.item == 1 ? this.value = 'page.用户协议' : this.value = 'page.隐私政策'
			option.item == 1 ? this.privacy = agreement : this.privacy = policy
			// this.getData()
		},
		methods: {
			// async getData() {
			// 	let result = requestData(this.query)
			// 	let {txt} = await getAgreePolicy(result)
			// 	this.privacy = txt
			// }
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - ${this.$store.state.navbarHeight}px - env(safe-area-inset-bottom) - ${this.$store.state.statusHeight}px)`
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.privacy {
		min-height: 100%;
		background-color: #111;
		color: #fff;

		.load {
			width: 100%;
			height: 100rpx;
		}

		.main {
			padding: 36rpx 30rpx;

			/deep/ p {
				margin-bottom: 20rpx !important;
				// line-height: 40rpx !important;
				background-color: #111 !important;
				color: #fff !important;
				font-size: 28rpx !important;
				line-height: 40rpx !important;
			}

			/deep/ span {
				background-color: #111 !important;
				color: #fff !important;
				font-size: 28rpx !important;
			}
		}
	}
</style>