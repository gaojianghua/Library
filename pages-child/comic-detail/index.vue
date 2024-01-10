<template>
	<view class="page">
		<m-scroll :isLoading="false" i18n :scrollStyle="{height: `calc(100% - 100rpx - env(safe-area-inset-bottom))`}"
			bgColor="transparent" @onRefresh="onRefresh">
			<m-navbar :isSticky="false" bgColor="#11111180" textColor="#111" :borderBottom="false">
				<view slot="right" class="ml-auto mr-2" @click="shareMethods()">
					<u-icon name="share-square" size="24" color="#fff"></u-icon>
				</view>
			</m-navbar>
			<view :style="{height: `calc(${$store.state.statusHeight}px + ${$store.state.navbarHeight}px)`}"></view>
			<view class="d-flex a-center j-sb w-100">
				<view class="mr-1"
					style="width: 300rpx; height: 4rpx; background: #6F43FE;border-radius: 0 15rpx 15rpx 0;"></view>
				<view class="d-flex a-center">
					<u-icon class="mt-1" style="transform: rotate(-45deg);" name="heart-fill" size="16"
						color="#6F43FE"></u-icon>
					<u-icon class="mx-1 mb-1" name="heart-fill" size="22" color="#6F43FE"></u-icon>
					<u-icon class="mt-1" style="transform: rotate(45deg);" name="heart-fill" size="16"
						color="#6F43FE"></u-icon>
				</view>
				<view class="ml-1"
					style="width: 300rpx; height: 4rpx; background: #6F43FE;border-radius: 15rpx 0 0 15rpx;"></view>
			</view>
			<view class="p-3 d-flex a-center j-center flex-column">
				<u-image radius="5" width="290rpx" height="400rpx" :src="detail.picx"></u-image>
				<view class="mt-2 font-md font-weight text-white">
					{{detail.name}}
				</view>
				<view class="" style="font-size: 26rpx; color: #6F43FE;">
					{{detail.author}}
				</view>
				<view class="mx-3 text-center" style="color: #999;">
					{{detail.score}}{{$t('分')}} · {{detail.state}}
				</view>
				<view class="mx-3 mt-3 text-center" style="color: #999;">
					{{detail.text}}
				</view>
			</view>
			<u-gap height="10rpx" bgColor="#111723"></u-gap>
			<view class="px-3">
				<view class="see-t d-flex a-center mt-2">
					<view class="see-t-l d-flex flex-column">
						<span class="see-title text-white font-weight">{{$t('同类推荐')}}</span>
					</view>
					<view class="see-t-r ml-auto d-flex a-center">
						<span class="more" @click="refresh">{{$t('换一换')}}</span>
						<u-icon :class="isRote ? 'uicon' : ''" name="reload" size="20" color="#86888F"></u-icon>
					</view>
				</view>
				<view v-if="loveList.length == 0" class="d-flex a-center j-center">
					<u-empty class="p-5" mode="list" :text="$t('暂无数据')" icon="/static/img/common/white-empty.png">
					</u-empty>
				</view>
				<view v-if="loveList.length != 0" class="see-list d-flex flex-wrap mt-1">
					<view class="see-item d-flex flex-column mb-2" v-for="(item, i) in loveList" :key="i"
						@click="shuaxin(item.id)">
						<view class="position-relative">
							<u-image radius="5" width="100%" height="222rpx" :src="item.pic"></u-image>
							<view v-if="item.is_minors == 1"
								class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
								style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
								18
							</view>
						</view>
						<view class="item-freename mt-1 initial text-ellipsis1" style="width: 157.5rpx;">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</m-scroll>
		<!-- 章节列表弹窗 -->
		<m-popup title="目录" i18n :show="chapterShow" @close="chapterShow = false">
			<view class="d-flex j-sb a-center px-3" style="height: 88rpx;">
				<view>
					<text style="color: #111;">{{detail.state}}({{chapterList.length}})</text>
				</view>
				<view class="sort d-flex a-center" @click="openSort">
					<image :src="`/static/img/common/${isSort ? 'asc' : 'desc'}.png`">
					</image>
				</view>
			</view>
			<view class="px-3 pb-3" style="height: 80vh;">
				<scroll-view scroll-y="true" style="height: 100%;">
					<view class="chapter-item d-flex pt-3" @click="openChapter(item.id)"
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
		</m-popup>
		<!-- 底部按钮 -->
		<view class="tabbar bottom-0 left-0 w-100 position-fixed">
			<view style="display: flex; margin-left: auto;margin-right: auto;height: 100%;">
				<view class="d-flex a-center j-sb w-100 px-3">
					<view class="d-flex a-center text-white" @click="chapterShow = true">
						<u-icon name="list-dot" size="22" color="#6F43FE"></u-icon>
						<span class="ml-1">{{$t('目录')}}</span>
					</view>
					<u-button @click="read" :text="$t('立即阅读')" color="linear-gradient(90deg, #754AFF 0%, #4812FC 100%)"
						class="text-white"
						style="width: 30%;height: 60%; margin: auto;border-radius: 20rpx 0 20rpx 0;"></u-button>
					<view class="d-flex a-center" @click="openCollect">
						<u-icon v-if="detail.fav==0" name="heart" size="22" color="#6F43FE"></u-icon>
						<u-icon v-else name="heart-fill" size="22" color="#6F43FE"></u-icon>
						<span class="ml-1" style="font-size: 30rpx;"
							:style="{color: detail.fav==0? '#fff':'#6F43FE'}">{{$t('收藏')}}</span>
					</view>
				</view>
			</view>
		</view>
		<!-- 分享海报 -->
		<mine-app-share @closePoster="closePoster" @success="success" :posterShow="posterShow" :item="detail" />
		<!-- 分享方式 -->
		<share-mthods :show="shareShow" @close="shareShow = false" @copyLink="copyLink" @sharePoster="sharePoster" />
		<!-- 取消收藏弹窗 -->
		<m-modal :show="favorShow" title="温馨提示" @cancel="favorShow=false" @confirm="cancelFav()">
			<view class="d-flex a-center j-center">
				{{$t('确定要取消收藏吗？')}}
			</view>
		</m-modal>
	</view>
</template>

<script>
	import MineAppShare from '@/components/mine-app-share/index.vue'
	import ShareMthods from '@/components/share-methods/index.vue'
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import MModal from '@/main_modules/main-ui/m-modal/index.vue'
	import MPopup from '@/main_modules/main-ui/m-popup/index.vue'
	import share from '@/mixins/share.js'
	import {
		requestData
	} from '@/utils/index.js'
	import {
		addCases,
		delCases,
		getDetail,
		getChapterList,
		getComicData
	} from '@/utils/request/api/get.js'
	export default {
		mixins: [share],
		components: {
			MScroll,
			MModal,
			MPopup,
			MineAppShare,
			ShareMthods
		},
		data() {
			return {
				chapterShow: false,
				favorShow: false, //取消收藏弹窗显示控制
				loveList: [],
				loveQuery: {
					pay: '0', //3
					page: 1,
					size: 8,
					cid: '',
					sort: 'addtime'
				},
				chapterList: [],
				size: 0,
				isSort: true,
				chapter_page_num: 1,
				id: 0, //漫画ID
				detail: {},
				posterShow: false,
				isSuccess: false,
				time: null,
				inviteid: '',
				isRote: false
			}
		},
		onLoad(option) {
			this.id = option.id
			this.inviteid = option.inviteid && option.inviteid
		},
		onShow() {
			this.init()
		},
		methods: {
			// 初始化
			init() {
				this.getDetailInfo()
				this.getChapterListInfo()
			},
			// 获取同类书架
			async getTypeData() {
				this.isRote = true
				this.loveQuery.cid = this.detail.cid
				let result = requestData(this.loveQuery)
				let {
					list
				} = await getComicData(result)
				this.loveList = list
				let time = setTimeout(() => {
					this.isRote = false
					clearTimeout(time)
				}, 1000)
			},
			openChapter(chapter_id) {
				uni.navigateTo({
					url: '/pages-child/comic-read/index?book_id=' + this.id + '&id=' + chapter_id
				})
				this.chapterShow = false
			},
			openSort() {
				this.isSort = !this.isSort
				this.chapterList = this.chapterList.reverse()
			},
			read() {
				if (this.detail.chapter.id) {
					uni.navigateTo({
						url: '/pages-child/comic-read/index?book_id=' + this.id + '&id=' + this.detail.chapter.id
					})
				} else {
					uni.navigateTo({
						url: '/pages-child/comic-read/index?book_id=' + this.id
					})
				}
			},
			async openCollect() {
				if (this.detail.fav !== 0) {
					this.favorShow = true
				} else {
					let result = requestData({
						id: this.id
					})
					let {} = await addCases(result)
					this.detail.fav = 1
					this.detail.shits = parseInt(this.detail.shits) + 1
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: this.$t("收藏成功")
					});
				}
			},
			// 取消收藏
			async cancelFav() {
				let result = requestData(this.query)
				let {} = await delCases(result)
				this.detail.fav = 0
				this.detail.shits = parseInt(this.detail.shits) - 1
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: this.$t("已取消收藏")
				});
				this.favorShow = false
			},
			async getChapterListInfo() {
				let result = requestData({
					id: this.id
				})
				let {
					list
				} = await getChapterList(result)
				this.chapterList = list
			},
			async getDetailInfo() {
				let result = requestData({
					id: this.id
				})
				let {
					comic
				} = await getDetail(result)
				this.detail = comic
				this.getTypeData()
			},
			onRefresh() {
				this.init()
			},
			shuaxin(i) {
				this.id = i
				this.init()
			},
			refresh() {
				this.loveQuery.page++
				this.getTypeData()
			}
		}
	}
</script>

<style lang="scss">
	.page {
		.see-t {
			.see-t-l {
				.see-title {
					font-size: 32rpx;
					color: #AFAFAF;
				}

				.see-desc {
					font-size: 22rpx;
					color: #c2c2c2;
				}
			}

			.more {
				font-size: 28rpx;
				color: #86888F;
			}

			.uicon {
				animation: rotate 0.5s linear infinite;
			}

			@keyframes rotate {
				0% {
					transform: rotate(0);
				}

				100% {
					transform: rotate(720deg);
				}
			}
		}

		.see-list {
			.see-item {
				width: 23.5%;
				margin-right: 2%;

				.item-name {
					font-size: 26rpx;
					color: #999;
				}

				.item-freename {
					font-size: 28rpx;
					color: #666;
				}

				.item-type {
					font-size: 24rpx;
					color: #bbb;
				}
			}

			.see-item:nth-child(4n) {
				margin-right: 0;
			}
		}
	}

	.tabbar {
		height: 100rpx;
		background-color: #050B18;
	}

	.active {
		color: #6F43FE;
	}

	.per {
		color: #111;
	}

	.love-item {
		margin-right: 20rpx;
	}

	.sort {
		width: 45rpx;
		height: 45rpx;
	}

	.love-item:last-child {
		margin-right: 0 !important;
	}

	.isVip {
		padding: 5rpx 15rpx;
		border-radius: 8rpx 0px 8rpx 0px;
		color: #A1562F;
		background: linear-gradient(270deg, #F3D1B1 0%, #E2A167 100%);
	}
</style>