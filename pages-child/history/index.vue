<template>
	<view class="page">
		<m-navbar :borderBottom="false" :textStyle="$store.state.navbarTextStyle" :bgColor="$store.state.bgColor" i18n value="page.阅读历史">
			<view v-if="list.length != 0" slot="right" class="position-absolute top-half border rounded line-h px-2 py-1" style="right: 20rpx; transform: translateY(-50%);" 
			:class="isEdit ? 'main-text-color main-border-color' : 'text-white'" @click="isEdit = !isEdit">
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
		<m-scroll :isLoading="isLoading" i18n :scrollStyle="scrollStyle" :load="load"
			@loadmore="loadmore" bgColor="transparent" @onRefresh="onRefresh">
			<u-empty class="p-5" v-if="load != 0 && list.length == 0" mode="list" :text="$t('暂无数据')"
				icon="/static/img/common/white-empty.png">
			</u-empty>
			<template v-if="list.length != 0">
				<view class="item d-flex a-center j-sb rounded p-2 mt-2"
					v-for="(item, i) in list" :key="i" @click="isEdit ? ()=>{return} : itemClick(item)">
					<u-image radius="6" width="180rpx" height="250rpx" :src="item.picx"></u-image>
					<view class="item-r ml-2 d-flex flex-1 j-sb flex-column" style="height: 250rpx;">
						<view class="title text-white font-weight text-ellipsis1">
							{{item.name}}
						</view>
						<view class="news  main-text-color">
							{{$t('阅读至')}}：{{item.chapter.name}}
						</view>
						<view class="d-flex text-white a-center">
							<view class="item-school auto-feed-letter">
								{{$t('作者')}}: {{item.author}}
								<!-- {{item.school | numberFormat('w', 'cn')}}{{$t('书友在读')}} -->
							</view>
						</view>
						<view class="desc text-white d-flex a-center">
							<view class="item-type">
								<!-- {{item.type}} · {{item.state == 1 ? $t('连载中') : $t('已完结')}} -->
								{{item.state}}
							</view>
							<view v-if="isEdit" @click.stop="checkClick(item)" class="check-icon d-flex a-center j-center ml-auto" :class="item.check ? 'check-active': ''">
								<u-image v-if="item.check" width="18" height="18" src="/static/img/common/task.svg"></u-image>
							</view>
							<view v-else-if="!item.is_fav" class="btns ml-auto text-white line-h d-flex a-center j-center" @click.stop="addBookshelf(item)">
								+{{$t('书架')}}
							</view>
						</view>
					</view>
				</view>
			</template>
		</m-scroll>
		<view v-if="isEdit && list.length != 0" class="settlement border-top main-border-color px-3 w-100 position-fixed bottom-0 left-0 d-flex a-center">
			<view class="d-flex a-center">
				<view @click="openAllCheck" class="check-icon d-flex a-center j-center" :class="allChecked ? 'check-active': ''">
					<u-image v-if="allChecked" width="18" height="18" src="/static/img/common/task.svg"></u-image>
				</view>
				<view class="ml-1" :class="allChecked ? 'main-text-color' : 'text-white'">
					{{$t('全选')}}
				</view>
			</view>
			<view class="btn ml-auto text-white py px-3 d-flex j-center a-center" @click="deleteSubmit">
				{{$t('移除')}}
			</view>
		</view>
	</view>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import {
		getMyReadData,
		getNovelReadOld,
		addNovelShelf,
		addCases,
		delReadOld,
		delNovelReadOld,
		delNovelShelf
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
				isEdit: false,
				isLoading: true,
				tabActive: 0,
				list: [],
				query: {
					page: 1,
					size: 20
				},
				load: 0,
				allChecked: false,
				istrig: true
			}
		},
		onLoad() {
			this.getHistory()
		},
		methods: {
			async getHistory(e) {
				let result = requestData(this.query)
				let res
				if (this.tabActive == 0) {
					res = await getMyReadData(result)
				} else {
					res = await getNovelReadOld(result)
				}
				if (res.code == 1) {
					if(res.list.length == 0) {
						this.isEdit = false
					}else {
						res.list.forEach((item) => {
							item.check = false
						})
					}
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
				this.getHistory()
			},
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.query.page++
				this.istrig = false
				let time = setTimeout(() => {
					this.getHistory('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
			openTabs(i) {
				this.list = []
				this.isLoading = true
				this.load = 0
				this.tabActive = i
				this.allChecked = false
				this.list.forEach((item) => {
					item.check = false
				})
				this.isEdit = false
				this.onRefresh()
			},
			// 进入阅读页
			itemClick(i) {
				if (this.tabActive == 0) {
					uni.navigateTo({
						url: '/pages-child/comic-read/index?book_id=' + i.id + '&id=' + i.chapter.id
					})
				} else {
					let obj = {
						bid: i.bid,
						zid: i.chapter.id,
						isResume: true
					}
					this.$tools.Navigate.navigateTo('/pages-child/novel-read/index', obj)
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
						this.tabActive == 0 ? ids.push(item.id) : ids.push(item.bid)
					}
				})
				this.allChecked = bool
				this.ids = ids
			},
			// 删除
			async deleteSubmit(i) {
				let result = requestData({
					ids: this.ids.join()
				})
				let res
				if (this.tabActive == 0) {
					res = await delReadOld(result)
				}else {
					res = await delNovelReadOld(result)
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
			// 全选
			openAllCheck() {
				this.allChecked = !this.allChecked
				this.list.forEach((item) => {
					item.check = this.allChecked
				})
				if (this.tabActive == 0) {
					this.allChecked ? this.ids = this.list.map((item)=>item.id) : this.ids = []
				}else {
					this.allChecked ? this.ids = this.list.map((item)=>item.bid) : this.ids = []
				}
			},
			// 加入书架
			async addBookshelf(i) {
				let result = requestData({
					id: this.tabActive == 0 ? i.id : i.bid
				})
				let res
				if (this.tabActive == 0) {
					res = await addCases(result)
				}else {
					res = await addNovelShelf(result)
				}
				if (res.code == 1) {
					this.onRefresh()
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: this.$t("收藏成功")
					});
				}
			}
		},
		computed: {
			scrollStyle() {
				let size = this.isEdit ? '100rpx' : '0rpx'
				return {
					height: `calc(100vh - ${size} - 80rpx - env(safe-area-inset-bottom) - ${this.$store.state.statusHeight}px - ${this.$store.state.navbarHeight}px)`
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabs{
		height: 80rpx;
		border-bottom: 1rpx solid #333;
	}
	.default{
		
	}
	.active{
		border-color: #6F43FE;
		color: #6F43FE;
	}
	.page{
		.item{
			.item-r{
				height: 250rpx;
				.title{
					font-size: 32rpx;
				}
				.news{
					font-size: 28rpx;
					line-height: 34rpx;
				}
				.desc{
					height: 55rpx;
					.state{
						font-size: 26rpx;
					}
					.btns{
						border-radius: 10rpx;
						font-size: 26rpx;
						padding: 12rpx 22rpx;
						background-color: #6F43FE;
					}
				}
				.item-type {
					color: #eee;
					font-size: 24rpx;
				}
				
				.item-info {
					color: #FA9C3E;
					font-size: 28rpx;
				}
				
				.item-school {
					color: #eee;
					line-height: 32rpx;
					font-size: 24rpx;
				}
			}
			
		}
		.item:first-child{
			margin-top: 0 !important;
		}
		.settlement{
			height: 100rpx;
			.btn{
				border-radius: 16rpx;
				background-color: #6F43FE;
			}
		}
		.check-icon{
			width: 45rpx;
			height: 45rpx;
			padding: 6rpx;
			border: 4rpx solid #fff;
			border-radius: 10rpx;
		}
		.check-active{
			border: 4rpx solid #6F43FE;
		}
	}
</style>