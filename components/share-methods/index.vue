<template>
	<m-popup :show="show" @close="close" bgColor="#6F43FE" i18n title="分享">
		<view class="share d-flex j-around a-center py-5">
			<view class="text-center py-1 rounded-1 main-bg-color text-white" style="width: 38%;" @click="copyLink">
				{{$t('复制链接')}}
			</view>
			<view class="text-center py-1 rounded-1 main-bg-color text-white" style="width: 38%;" @click="sharePoster">
				{{$t('生成海报')}}
			</view>
		</view>
	</m-popup>
</template>

<script>
	import MPopup from '@/main_modules/main-ui/m-popup/index.vue'
	export default {
		components: {
			MPopup
		},
		props: {
			show: {
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
			close() {
				this.$emit('close')
			},
			copyLink() {
				this.$emit('copyLink')
			},
			sharePoster() {
				this.$emit('sharePoster')
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>