<template>
	<view class="page">
		<m-navbar :borderBottom="false" :bgColor="$store.state.bgColor" value="page.热门推荐" i18n>
		</m-navbar>
		<m-scroll :isLoading="isLoading" i18n :load="load" :scrollStyle="scrollStyle" @loadmore="loadmore"
			bgColor="transparent" @onRefresh="onRefresh">
			<view class="list px-2">
				<u-empty v-if="load != 0 && list.length == 0" mode="list" :text="$t('暂无数据')"
					icon="/static/img/common/list.png">
				</u-empty>
				<view class="item d-flex a-center mt-3" v-for="(item, i) in list" :key="i" @click="itemClick(item)">
					<view class="position-relative">
						<u-image height="230rpx" radius="5px" width="174rpx" :src="item.picx"></u-image>
						<view v-if="item.is_minors == 1" class="position-absolute font line-h top-0 right-0 py-1 px-1"
							style="border-radius: 0 10rpx 0 10rpx; background-color: #ffdd00;">
							18
						</view>
					</view>
					<view class="d-flex flex-column j-sb ml-2" style="height: 230rpx;">
						<view class="item-name text-white line-h mt-2">
							{{item.name}}
						</view>
						<view class="item-desc flex-1 d-flex flex-column line-h mt-2">
							<view class="item-type d-flex a-center">
								{{$t('最新')}}: {{item.news_name}}
							</view>
							<view class="item-type  d-flex a-center">
								{{item.state}}
							</view>
							<view class="item-author text-ellipsis1">
								{{item.text}}
							</view>
						</view>
					</view>
				</view>
			</view>
		</m-scroll>
	</view>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import {
		getComicData
	} from '@/utils/request/api/get.js'
	import {
		requestData
	} from '@/utils/index.js'
	export default {
		components: {
			MScroll
		},
		data() {
			return {
				isLoading: true,
				list: [],
				query: {
					page: 1,
					size: 20,
					cid: 0,
					sort: 'addtime'
				},
				load: 0,
				istrig: true,
				value: ''
			}
		},
		onLoad() {
			this.getBook()
		},
		methods: {
			async getBook(e) {
				let result = requestData(this.query)
				let {
					list,
					nums,
					code
				} = await getComicData(result)
				if (code == 1) {
					if (e) { // 加载更多
						this.list = this.list.concat(list)
					} else {
						this.list = list
					}
					if (this.query.page * this.query.size >= nums) {
						return this.load = 1
					} else {
						return this.load = 2
					}
				}
			},
			// 下拉刷新
			onRefresh() {
				this.query.page = 1
				this.getBook()
			},
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.query.page++
				this.istrig = false
				let time = setTimeout(() => {
					this.getBook('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
			itemClick(i) {
				uni.navigateTo({
					url: '/pages-child/comic-detail/index?id=' + i.id
				})
			}
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

<style lang="scss" scoped>
	.list {
		.item {

			.item-name {
				font-size: 32rpx;
				color: #333;
				font-weight: 500;
			}

			.item-desc {
				color: #c2c2c2;
				font-size: 24rpx;

				.item-type {
					color: #666;
					font-size: 28rpx;
				}

				.item-author {
					color: #909399;
					font-size: 28rpx;
					white-space: normal;
				}
			}
		}

		.item:first-child {
			margin-top: 0 !important;
		}
	}
</style>