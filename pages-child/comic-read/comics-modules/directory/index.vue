<template>
	<m-popup :show="show" i18n @close="close" title="目录" zIndex="10071" i18n>
		<view class="directory px-2">
			<view class="directory-top d-flex a-center j-sb">
				<view class="d-flex a-center">
					<view class="">
						{{detail.serialize}}
					</view>
					<view class="ml-1">
						({{chapterList.length}})
					</view>
				</view>
				<view class="sort d-flex a-center" @click="openSort">
					<image
						:src="`/static/img/common/${isSort ? 'asc' : 'desc'}.png`">
					</image>
				</view>
			</view>
			<view class="pb-3" style="height: 80vh;">
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="chapter-item d-flex pt-3" @click="openChapter(item.id, i)"
						v-for="(item, i) in chapterList" :key="i">
						<view style="position: relative;border-radius: 8rpx;width: 230rpx;height: 144rpx;;">
							<image :src="item.picx" style="width: 230rpx;height: 144rpx;border-radius: 5px;"
								mode="aspectFill" lazy-load></image>
							<view
								style="padding: 5rpx 15rpx;position: absolute;left: 0px;top: 0;border-radius: 8rpx 0px 8rpx 0px;background-color: rgba(150, 150, 150, .6);"
								v-if="item.cion!=='0'">
								<u-icon name="lock" color="#111" size="18"></u-icon>
							</view>
							<view class="isVip line-h font-weight position-absolute left-0 top-0"
								v-else-if="item.vip!=='0'">
								VIP
							</view>
						</view>
						<view class="d-flex flex-column pl-2 j-sb">
							<view style="line-height: 50rpx;">
								<view style="font-size: 28rpx; font-weight: 500;color: #111;">{{item.name}}</view>
							</view>
							<view style="line-height: 50rpx;">
								<u-text :text="item.addtime | date('yyyy-mm-dd')" color="grey" size="12"></u-text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</m-popup>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import MPopup from '@/main_modules/main-ui/m-popup/index.vue'
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			detail: {
				type: Object,
				default: () => {
					return {}
				}
			},
			chapterList: {
				type: Array,
				default: () => {
					return []
				}
			},
			chapterId: {
				type: Number,
				default: () => {
					return 0
				}
			}
		},
		components: {
			MPopup,
			MScroll
		},
		data() {
			return {
				intoView: '',
				scrollTop: 0,
				isSort: true
			}
		},
		methods: {
			// 关闭
			close() {
				this.$emit('close')
			},
			// 排序
			openSort() {
				this.isSort = !this.isSort
				this.scrollTop = 1
				this.$nextTick(() => {
					this.scrollTop = 0
				})
				this.$emit('openSort')
			},
			// 打开某个章节
			openChapter(id, i) {
				this.$emit('openChapter', {id, i})
			}
		},
		computed: {
			directoryStyle() {
				return {
					height: `calc(100% - 88rpx - env(safe-area-inset-bottom))`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.directory {
		height: 80vh;
	
		.directory-top {
			height: 88rpx;
	
			.sort {
				width: 45rpx;
				height: 45rpx;
			}
		}
	
		.isVip {
			padding: 5rpx 15rpx;
			border-radius: 8rpx 0px 8rpx 0px;
			color: #A1562F;
			background: linear-gradient(270deg, #F3D1B1 0%, #E2A167 100%);
		}
	}
	.list-item{
		font-size: 0;
	}
</style>