<!-- 产品 -->
<template>
	<view class="page">
		<m-navbar :borderBottom="false" :textStyle="$store.state.navbarTextStyle" :bgColor="$store.state.bgColor"
			i18n value="page.我的书架">
			<view v-if="list.length != 0" slot="right"
				class="position-absolute top-half border rounded line-h px-2 py-1"
				style="right: 20rpx; transform: translateY(-50%);"
				:class="isEdit ? 'main-text-color main-border-color' : 'text-white'" @click="switchManageClick">
				{{isEdit ? $t('取消') : $t('编辑')}}
			</view>
		</m-navbar>
		<view class="d-flex a-center j-around tabs">
			<view class="" :class="tabActive == 0 ? 'main-text-color' : 'text-white'" @click="openTabs(0)">
				{{$t('page.漫画')}}
			</view>
			<view class="" :class="tabActive == 1 ? 'main-text-color' : 'text-white'" @click="openTabs(1)">
				{{$t('page.小说')}}
			</view>
		</view>
		<m-scroll :isLoading="isLoading" :load="load" i18n :scrollStyle="scrollStyle" @loadmore="loadmore"
			bgColor="transparent" @onRefresh="onRefresh">
			<u-empty class="p-5" v-if="load != 0 && list.length == 0" mode="list" :text="$t('暂无数据')"
				icon="/static/img/common/white-empty.png">
			</u-empty>
			<view v-if="list.length != 0" class="list px-3 pt-1 d-flex flex-wrap">
				<view class="item mt-2 d-flex flex-column position-relative" v-for="(item, i) in list" :key="i"
					@click.stop="itemClick(item)">
					<view class="position-relative">
						<image class="item-img" :src="item.picx" mode=""></image>
						<view v-if="item.is_minors == 1" class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
							style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
							18
						</view>
					</view>
					<view class="item-name flex-1 line-h mt-2 text-white initial text-ellipsis1">
						{{item.name}}
					</view>
					<view class="item-desc line-h mt-2 text-ellipsis1">
						{{$t('最新')}}: {{item.news_name}}
					</view>
					<view v-if="isEdit" style="background: #11111180;"
						class="position-absolute index-3 d-flex a-center j-center top-0 right-0 left-0 bottom-0 index-5"
						@click.stop="checkClick(item)">
						<view class="position-relative w-100 h-100">
							<view class="position-absolute" style="top: 20rpx; right: 20rpx;">
								<view class="check-icon d-flex a-center j-center"
									:class="item.check ? 'check-active': ''">
									<u-image v-if="item.check" width="18" height="18"
										src="/static/img/common/task.svg"></u-image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</m-scroll>
		<view v-if="isEdit && list.length != 0" class="settlement bottom-0 d-flex j-sb a-center">
			<view class="d-flex a-center">
				<view @click="openAllCheck" class="check-icon d-flex a-center j-center" :class="allChecked ? 'check-active': ''">
					<u-image v-if="allChecked" width="18" height="18" src="/static/img/common/task.svg"></u-image>
				</view>
				<view class="ml-1" :class="allChecked ? 'main-text-color' : 'text-white'">
					{{$t('全选')}}
				</view>
			</view>
			<view class="btn d-flex text-white j-center a-center" @click="deleteSubmit">
				{{$t('移除')}}
			</view>
		</view>
	</view>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import {
		delCases,
		delReadOld,
		delNovelShelf,
		delNovelReadOld,
		getBookShelf,
		getNovelShelf
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
				ids: [],
				allChecked: false,
				tabActive: 0,
				isLoading: true,
				list: [],
				query: {
					page: 1,
					size: 20
				},
				load: 0,
				isEdit: false,
				istrig: true,
				islongPress: false
			}
		},
		onShow() {
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.getBook()
			},
			async getBook(e) {
				let result = requestData(this.query)
				let res
				if (this.tabActive == 0) {
					res = await getBookShelf(result)
				} else {
					res = await getNovelShelf(result)
				}
				if (res.code == 1) {
					res.list.forEach((item) => {
						item.check = false
					})
					if (e) { // 加载更多
						this.list = this.list.concat(res.list)
					} else {
						this.list = res.list
					}
					if (this.query.page * this.query.size >= res.nums) {
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
				if (this.tabActive == 0) {
					uni.navigateTo({
						url: '/pages-child/comic-detail/index?id=' + i.mid
					})
				} else {
					uni.navigateTo({
						url: '/pages-child/novel-detail/index?id=' + i.bid
					})
				}
			},
			// 单选
			checkClick(i) {
				let ids = []
				let bool = true
				this.list.forEach((item) => {
					if (this.tabActive == 0) {
						if (item.id == i.id) {
							item.check = !item.check
						}
					} else {
						if (item.bid == i.bid) {
							item.check = !item.check
						}
					}
					if (!item.check) {
						bool = item.check
					} else {
						this.tabActive == 0 ? ids.push(item.mid) : ids.push(item.bid)
					}
				})
				this.allChecked = bool
				this.ids = ids
			},
			// 管理开关
			switchManageClick() {
				this.ids = []
				this.allChecked = false
				this.list.forEach((item) => {
					item.check = false
				})
				this.isEdit = !this.isEdit
			},
			// 全选
			openAllCheck() {
				this.allChecked = !this.allChecked
				if (!this.allChecked) {
					this.list.forEach((item) => {
						item.check = this.allChecked
					})
					return this.ids = []
				}
				let ids = []
				this.list.forEach((item) => {
					item.check = this.allChecked
					this.tabActive == 0 ? ids.push(item.mid) : ids.push(item.bid)
				})
				this.ids = ids
			},
			// 删除
			async deleteSubmit() {
				let result = requestData({
					ids: this.ids.join()
				})
				console.log(result)
				let res
				if (this.tabActive == 0) {
					res = await delCases(result)
				} else {
					res = await delNovelShelf(result)
				}
				if (res.code == 1) {
					this.ids = []
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: this.$t("移除成功")
					});
					this.onRefresh()
				}
			},
			openTabs(i) {
				this.list = []
				this.isLoading = true
				this.load = 0
				this.tabActive = i
				this.isEdit = false
				this.onRefresh()
			}
		},
		computed: {
			scrollStyle() {
				let size = this.isEdit ? '100rpx' : '0rpx'
				return {
					height: `calc(100vh - ${size} - 80rpx - ${this.$store.state.navbarHeight}px - env(safe-area-inset-bottom) - ${this.$store.state.statusHeight}px)`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		.check-icon {
			width: 45rpx;
			height: 45rpx;
			padding: 6rpx;
			border: 4rpx solid #fff;
			border-radius: 10rpx;
		}

		.check-active {
			border: 4rpx solid #6F43FE;
		}

		.tabs {
			height: 80rpx;
			border-bottom: 1rpx solid #333;
		}

		.settlement {
			position: fixed;
			left: 0;
			width: 100%;
			height: 100rpx;
			background: #111;
			padding: 0 25rpx;
			border-top: 1rpx solid #6F43FE80;

			.btn {
				width: 150rpx;
				height: 58rpx;
				background: #6F43FE;
				border-radius: 30rpx;
				font-weight: 500;
				color: #111;
				font-size: 25rpx;
				margin-left: 25rpx;
			}

			.btn:active {
				background: #6F43FE99;
			}
		}

		.active {
			border: 2rpx solid #6F43FE;
			background: rgba(255, 211, 0, 0.1);
			font-weight: 500;
			font-size: 30rpx;
			color: #6F43FE;
			border-radius: 50rpx;
			height: 60rpx;
		}

		.default {
			color: #595C65;
			font-weight: 500;
			font-size: 30rpx;
		}

		.list {
			.item {
				width: 31.3%;
				margin-right: 20rpx;

				.item-img {
					height: 284rpx;
					border-radius: 8rpx;
					background-color: #888;
				}

				.item-name {
					font-size: 28rpx;
					color: #333;
				}

				.item-desc {
					color: #999;
					font-size: 24rpx;
					white-space: normal;
				}
			}

			.item:nth-child(3n) {
				margin-right: 0;
			}
		}
	}
</style>