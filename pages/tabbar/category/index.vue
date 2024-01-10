<template>
	<view class="page">
		<m-scroll :isLoading="isLoading" i18n :load="load" :scrollStyle="scrollStyle" @loadmore="loadmore"
			bgColor="transparent" @onRefresh="onRefresh">
			<m-top></m-top>
			<view class="tabs d-flex j-center a-center">
				<view v-for="(item,index) in comicOrNovel" :key="index">
					<view style="font-size: 30rpx;" class="text-center text-white p-2"
						:class="{active:item.id==comicOrNovel_id}" @click="comicOrNovelClick(item.id)">{{item.name}}
					</view>
				</view>
			</view>
			<view class="px-2">
				<m-tabs :textStyle="{color: '#96989C'}" :chooseTextStyle="{color: '#fff'}" :itemStyle="itemStyle"
					chooseBgColor="#6F43FE" scrollBgColor="transparent" bgColor="#353A47" :tabs="$store.state.allType"
					@changeTab="changeTab" :chooseIndex="chooseIndex">
				</m-tabs>
			</view>
			<view class="d-flex j-sb px-2 py-3">
				<view class="d-flex a-center">
					<view v-for="(item,index) in ends" :key="index">
						<view style="font-size: 28rpx;" class="text-center text-white mr-4" :class="{active:item.id==end_id}"
							@click="end_click(item.id)">{{item.end_name}}</view>
					</view>
				</view>
				<view class="d-flex a-center">
					<view v-for="(item,index) in pays" :key="index">
						<view style="font-size: 28rpx;" class="text-center text-white ml-4" :class="{active:item.id==pay_id}"
							@click="pay_click(item.id)">{{item.pay_name}}</view>
					</view>
				</view>
			</view>
			<u-gap height="10rpx" bgColor="#111723"></u-gap>
			<view class="d-flex a-center j-sb px-2 pt-2">
				<view class="d-flex a-center">
					<view v-for="(item,index) in sorts" :key="index">
						<view style="font-size: 28rpx;" class="text-center text-white mr-4" :class="{active:item.id==sort_id}"
							@click="sort_click(item.id)">{{item.name}}</view>
					</view>
				</view>
				<view class="d-flex a-center line-h text-white" @click="openSearch">
					{{$t('去搜索 >>')}}
				</view>
			</view>
			<u-empty class="p-5" v-if="load != 0 && list.length == 0" mode="list" :text="$t('暂无数据')"
				icon="/static/img/common/white-empty.png">
			</u-empty>
			<view v-if="list.length != 0" class="lists pt-3 px-2 main d-flex flex-wrap">
				<view v-for="(item, i) in list" :key="i" class="lists-item d-flex flex-column mt-2"
					@click="get_detail(item.id)">
					<view class="position-relative">
						<u-image width="100%" height="284rpx" radius="4" :src="item.pic" lazy-load></u-image>
						<view v-if="item.is_minors == 1" class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
							style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
							18
						</view>
					</view>
					<view class="item-info mt-1">
						<text class="item-title text-white text-ellipsis1">{{ item.name }}</text>
						<view class="item-state line-h text-ellipsis1 mt-1">
							{{item.author}}
						</view>
						<view class="item-desc text-ellipsis2 mt-1">
							{{item.text}}
						</view>
					</view>
				</view>
			</view>
		</m-scroll>
	</view>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import MTabs from '@/main_modules/main-ui/m-tabs/index.vue'
	import {
		getComicData,
		getNovelData,
		getType
	} from '@/utils/request/api/get.js'
	import {
		requestData
	} from '@/utils/index.js'
	export default {
		components: {
			MScroll,
			MTabs
		},
		data() {
			return {
				isLoading: true,
				load: 0,
				istrig: true,
				chooseIndex: 0,
				tabs: [{
					id: 0,
					name: this.$t('全部')
				}],
				ends: [{
					id: 0,
					end_name: this.$t('全部')
				}, {
					id: 1,
					end_name: this.$t('连载')
				}, {
					id: 2,
					end_name: this.$t('完结')
				}],
				pays: [{
						id: 0,
						pay_name: this.$t('全部')
					}, {
						id: 1,
						pay_name: this.$t('免费')
					},
					{
						id: 3,
						pay_name: this.$t('VIP')
					}
				],
				sorts: [{
					id: 0,
					name: this.$t('推荐')
				}, {
					id: 1,
					name: this.$t('最热')
				}, {
					id: 2,
					name: this.$t('最新')
				}],
				comicOrNovel: [{
						id: 0,
						name: this.$t('page.漫画')
					},
					{
						id: 1,
						name: this.$t('page.小说')
					}
				],
				tag_id: 0,
				end_id: 0,
				pay_id: 0,
				sort_id: 0,
				comicOrNovel_id: 0,
				query: {
					page: 1,
					size: 20,
					cid: 0,
					pay: 0,
					state: 0,
					sort: 0
				},
				itemStyle: {
					borderRadius: '10rpx',
					marginRight: '28rpx'
				},
				list: []
			}
		},
		onLoad(options) {
			if (options.id !== undefined) {
				this.query.cid = options.id
			}
			this.getTabs()
			this.getList()
		},
		methods: {
			openSearch() {
				this.$tools.Navigate.navigateTo('/pages-child/search/index', this.comicOrNovel_id + 1)
			},
			get_detail(name) {
				if (this.comicOrNovel_id == 0) {
					uni.navigateTo({
						url: '/pages-child/comic-detail/index?id=' + name
					})
				} else {
					uni.navigateTo({
						url: '/pages-child/novel-detail/index?id=' + name
					})
				}
			},
			changeTab(i) {
				this.load = 0
				this.isLoading = true
				this.list = []
				this.current = i.index
				this.query.cid = i.id
				this.onRefresh()
			},
			end_click(end_id) {
				this.load = 0
				this.isLoading = true
				this.list = []
				this.query.state = end_id
				this.end_id = end_id
				this.onRefresh()
			},
			pay_click(pay_id) {
				this.load = 0
				this.isLoading = true
				this.list = []
				this.query.pay = pay_id
				this.pay_id = pay_id
				this.onRefresh()
			},
			sort_click(sort_id) {
				this.load = 0
				this.isLoading = true
				this.list = []
				this.query.sort = sort_id
				this.sort_id = sort_id
				this.onRefresh()
			},
			comicOrNovelClick(id) {
				this.comicOrNovel_id = id
				this.onRefresh()
			},
			async getList(e) {
				switch (this.sort_id) {
					case 0:
						this.query.sort = 'score'
						break;
					case 1:
						this.query.sort = 'hits'
						break;
					case 2:
						this.query.sort = 'addtime'
						break;
					case 3:
						this.query.sort = 'id'
						break;
					default:
						this.query.sort = 'addtime'
						break;
				}
				let result = requestData(this.query)
				let res;
				if (this.comicOrNovel_id == 0) {
					res = await getComicData(result)
				} else {
					res = await getNovelData(result)
				}
				if (res.code == 1) {
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
				this.getList()
			},
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.query.page++
				this.istrig = false
				let time = setTimeout(() => {
					this.getList('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
			async getTabs() {
				let result = requestData()
				let {
					list
				} = await getType(result)
				list.unshift({
					id: 0,
					name: "全部"
				})
				this.$store.commit('updateAllType', list)
				uni.setStorageSync('allType', list)
			}
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - env(safe-area-inset-bottom) - ${this.$store.state.tabbarHeight}px)`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		// background-color: #fff;
	}

	.lists {

		.lists-item {
			width: 32%;
			margin-right: 2%;

			.item-info {
				.item-title {
					font-size: 28rpx;
					font-weight: 500;
					color: #333;
				}

				.item-state {
					color: #6F43FE;
					font-size: 26rpx;
				}

				.item-desc {
					font-size: 24rpx;
					color: #ddd;
				}
			}

		}

		.lists-item:nth-child(3n) {
			margin-right: 0 !important;
		}

		.lists-item:nth-child(1),
		.lists-item:nth-child(2),
		.lists-item:nth-child(3) {
			margin-top: 0 !important;
		}
	}

	.active {
		color: #6F43FE !important;
		font-weight: 500;
	}

	.top-warp {
		z-index: 9990;
		position: fixed;
		top: --window-top;
		/* css变量 */
		left: 0;
		width: 100%;
		height: 365upx;
		// background-color: white;
	}

	.top-warp .tip {
		font-size: 28upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}

	.main:after {
		content: "";
		width: 32%;
	}
</style>