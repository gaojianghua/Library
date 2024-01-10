<template>
	<view>
		<m-navbar :borderBottom="false" :bgColor="$store.state.bgColor" i18n value="关于我们">
		</m-navbar>
		<view class="d-flex a-center j-center pt-5">
			<u-image radius="50%" width="160rpx" height="160rpx" src="/static/logo.png"></u-image>
		</view>
		<view class="text-white font-weight font-md text-center mt-2">
			{{$t('锤子漫画')}}
		</view>
		<view class="text-center text-light-muted">
			V{{$store.state.appSystemInfo.appVersion}}
		</view>
		<view class="p-5 text-center" style="color: #B0B0B0; line-height: 48rpx;letter-spacing: 3rpx;">
			{{introduce}}
		</view>
		<view class="mt-auto d-flex a-center j-center main-text-color pb-3 boot">
			<span @click="openAgree(1)">《{{$t('用户协议')}}》</span> 
			<span class="text-light-muted"> · </span>
			<span @click="openAgree(2)">《{{$t('隐私政策')}}》</span>
		</view>
	</view>
</template>

<script>
	import { requestData } from '@/utils/index.js'
	import { getAgreePolicy } from '@/utils/request/api/get.js'
	export default {
		data() {
			return {
				introduce: ''
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			async getData() {
				// let result = requestData({type: 'company'})
				// let {txt} = await getAgreePolicy(result)
				this.introduce = '如果您是一個漫畫迷，那麼錘子漫畫是一款必備的應用。它提供了海量的漫畫資源，讓您可以隨時隨地暢享精彩的漫畫世界。在錘子漫畫中，您可以輕鬆找到各種類型的漫畫，包括熱門、經典、日本漫畫、國產漫畫等，滿足您對不同類型漫畫的需求。而且，應用還爲您提供了離線下載功能，無論您在哪裏，都可以隨時閱讀自己喜歡的漫畫。'
			},
			// 进入协议页面
			openAgree(e) {
				this.$tools.Navigate.navigateTo('/pages-child/privacy/index', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.boot{
		position: fixed;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
	}
</style>
