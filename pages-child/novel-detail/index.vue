<template>
	<view class="page">
		<m-scroll :isLoading="false" i18n @onRefresh="onRefresh"
			:style="{height: `calc(100vh - 100rpx - env(safe-area-inset-bottom))`}">
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
			<view class="content px-3">
				<view class="see mt-2">
					<view class="see-t d-flex a-center">
						<view class="see-t-l d-flex flex-column">
							<span class="see-title text-white font-weight">{{$t('同类推荐')}}</span>
						</view>
						<view class="see-t-r ml-auto d-flex a-center">
							<span class="more" @click="refresh">{{$t('换一换')}}
							</span>
							<u-icon :class="isRote ? 'uicon' : ''" name="reload" size="20" color="#86888F"></u-icon>
						</view>
					</view>
					<view v-if="freelist.length == 0" class="d-flex a-center j-center">
						<u-empty class="p-5" mode="list" :text="$t('暂无数据')" icon="/static/img/common/white-empty.png">
						</u-empty>
					</view>
					<view v-if="freelist.length != 0" class="see-list d-flex flex-wrap j-sb mt-1">
						<view class="see-item d-flex flex-column mb-2" v-for="(item, i) in freelist" :key="i"
							@click="openDetail(item.id)">
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
			</view>
		</m-scroll>
		<view class="bot w-100 position-fixed bottom-0 left-0 d-flex a-center j-sb">
			<view class="d-flex a-center" @click="openMenu">
				<u-icon name="list-dot" size="22" color="#6F43FE"></u-icon>
				<view class="text-white ml-1">
					{{$t('目录')}}
				</view>
			</view>
			<view class="bot-btn line-h text-white d-flex a-center j-center" @click="openRead(false)">
				{{$t('立即阅读')}}
			</view>
			<view class="d-flex a-center" @click="detail.fav == 0 ? addCollect() : collShow = true">
				<u-icon v-if="detail.fav == 0" name="heart" size="22" color="#6F43FE"></u-icon>
				<u-icon v-else name="heart-fill" size="22" color="#6F43FE"></u-icon>
				<span class="ml-1 line-h" style="font-size: 30rpx;"
					:style="{color: detail.fav == 0? '#fff':'#6F43FE'}">{{$t('收藏')}}</span>
			</view>
		</view>
		<!-- 弹出层 -->
		<m-popup :show="show" @close="show = false" title="目录" i18n>
			<view class="nation px-3">
				<view class="nation-title d-flex a-center j-sb">
					<view class="">
						{{detail.state}}({{chapterList.length}})
					</view>
					<view class="sort d-flex a-center" @click="openSort">
						<image :src="`/static/img/common/${isSort ? 'asc' : 'desc'}.png`">
						</image>
					</view>
				</view>
				<m-scroll :isLoading="false" :isCustomRefresh="false"
					:style="{height: `calc(100vh - 100rpx - env(safe-area-inset-bottom))`}">
					<view class="chapter-list">
						<view class="d-flex a-center pb-3" v-for="(item, i) in chapterList" :key="i"
							@click="openRead(item)">
							<view v-if="item.vip!=='0'" class="isVip line-h font-weight mr-2">
								VIP
							</view>
							<view class="name">
								{{item.name}}
							</view>
							<u-icon v-if="item.cion!=='0'" class="ml-auto" name="lock" color="#111" size="24"></u-icon>
						</view>
					</view>
				</m-scroll>
			</view>
		</m-popup>
		<!-- 取消收藏弹窗 -->
		<m-modal :show="collShow" title="温馨提示" @cancel="collShow = false" @confirm="delCollect">
			<view class="d-flex a-center j-center">
				{{$t('确定要取消收藏吗？')}}
			</view>
		</m-modal>
		<!-- 分享海报 -->
		<mine-app-share @closePoster="closePoster" @success="success" :posterShow="posterShow" :item="detail" />
		<!-- 分享方式 -->
		<share-mthods :show="shareShow" @close="shareShow = false" @copyLink="copyLink" @sharePoster="sharePoster" />
	</view>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import ShareMthods from '@/components/share-methods/index.vue'
	import MPopup from '@/main_modules/main-ui/m-popup/index.vue'
	import MModal from '@/main_modules/main-ui/m-modal/index.vue'
	import MineAppShare from '@/components/mine-app-share/index.vue'
	import share from '@/mixins/share.js'
	import {
		requestData
	} from '@/utils/index.js'
	import {
		getNovelData,
		addNovelShelf,
		delNovelShelf,
		getNovelDetail,
		getNovelChapterList
	} from '@/utils/request/api/get.js'
	export default {
		mixins: [share],
		components: {
			MScroll,
			MPopup,
			MineAppShare,
			ShareMthods,
			MModal
		},
		data() {
			return {
				show: false,
				isSort: true,
				collShow: false,
				query: {
					id: 0
				},
				detail: {},
				freeQuery: {
					pay: '0', //3
					state: '1',
					page: 1,
					size: 8,
					cid: '',
					sort: 'addtime'
				},
				freelist: [],
				chapterList: [],
				id: 0,
				inviteid: '',
				isRote: false
			}
		},
		onLoad(options) {
			this.id = options.id
			this.inviteid = options.inviteid && options.inviteid
			this.query.id = options.id
		},
		onShow() {
			this.getDetail()
			this.getNovelChapters()
		},
		methods: {
			// 获取详情
			async getDetail() {
				let result = requestData(this.query)
				let {
					code,
					book
				} = await getNovelDetail(result)
				this.detail = book
				this.getFreelist()
			},
			async getFreelist() {
				this.isRote = true
				this.query.cid = this.detail.class.id
				let result = requestData(this.freeQuery)
				let {
					list
				} = await getNovelData(result)
				this.freelist = list
				let time = setTimeout(() => {
					this.isRote = false
					clearTimeout(time)
				}, 1000)
				
			},
			refresh() {
				this.freeQuery.page++
				this.getFreelist()
			},
			// 收藏
			async addCollect() {
				let result = requestData({
					id: this.detail.id
				})
				let {} = await addNovelShelf(result)
				this.detail.fav = 1
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: this.$t("收藏成功")
				});
			},
			// 取消收藏
			async delCollect() {
				let result = requestData({
					ids: this.detail.id
				})
				let {} = await delNovelShelf(result)
				this.detail.fav = 0
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: this.$t("已取消收藏")
				});
				this.collShow = false
			},
			openMenu() {
				this.show = true
			},
			openRead(item) {
				if (item) {
					let obj = {
						bid: this.detail.id,
						zid: item.id,
						isResume: true
					}
					this.$tools.Navigate.navigateTo('/pages-child/novel-read/index', obj)
				} else {
					let obj = {
						bid: this.detail.id,
						zid: this.detail.chapter.id ? this.detail.chapter.id : '',
						isResume: this.detail.chapter.id ? true : false
					}
					console.log(obj)
					this.$tools.Navigate.navigateTo('/pages-child/novel-read/index', obj)
				}
			},
			// 设置排序
			openSort() {
				this.isSort = !this.isSort
				this.chapterList = this.chapterList.reverse()
			},
			// 点击推荐的
			openDetail(i) {
				this.query.id = i
				this.getDetail()
				this.getFreelist()
			},
			// 获取目录
			async getNovelChapters() {
				let result = requestData(this.query)
				let {
					list,
					code
				} = await getNovelChapterList(result)
				list.forEach((item, i) => {
					item.index = i
				})
				this.chapterList = list
			},
			onRefresh() {
				this.init()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {

		.info {
			bottom: -56rpx;
			left: 30rpx;

			.info-text {
				padding-bottom: 56rpx;

				.title {
					font-size: 30rpx;
					font-weight: 500;
					color: #fff;
				}

				.mark {
					font-size: 34rpx;
					font-weight: 500;
					color: #EF930A;
				}

				.item-type {
					color: #999;
					font-size: 26rpx;
				}

				.collect {}
			}

		}

		.content {

			.book-title {
				font-size: 30rpx;
				font-weight: 500;
			}

			.book-desc {
				overflow: hidden;
				width: 690rpx;
				color: #666666;
			}

			.current {
				border-radius: 16rpx;
				background: #F0F1F3;

				.resume {
					width: 328rpx;
					height: 60rpx;
					border-radius: 30rpx;
					font-size: 26rpx;
					color: #AFAFAF;
					border: 4rpx solid rgba(175, 175, 175, 0.56);
				}
			}

			.see {
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
						width: 24%;

						.item-name {
							font-size: 26rpx;
							color: #999;
						}

						.item-freename {
							font-size: 28rpx;
							color: #aaa;
						}

						.item-type {
							font-size: 24rpx;
							color: #bbb;
						}
					}
				}

				.recomm-list {
					.recomm-item {
						background: #1F2430;
						color: #676C78;
						font-size: 26rpx;
						padding: 4rpx 12rpx;
						border-radius: 4rpx;
					}

					.rank-item {
						width: 340rpx;

						.rank {
							font-size: 32rpx;
							font-weight: bold;
							color: #AFAFAF;
							width: 30rpx;
						}

						image {
							width: 102rpx;
							height: 132rpx;
							border-radius: 10rpx;
							background-color: #999;
						}

						.info {
							padding-top: 10rpx;
							// color: #fff;

							.info-name {
								line-height: 34rpx;
								font-size: 24rpx;
								font-weight: bold;
							}

							.info-desc {
								line-height: 34rpx;
								font-size: 22rpx;
								color: #999;
							}
						}
					}
				}
			}
		}

		.bot {
			height: 100rpx;
			background-color: #050B18;
			padding: 0 30rpx env(safe-area-inset-bottom);

			.bot-btn {
				background: linear-gradient(90deg, #754AFF 0%, #4812FC 100%);
				border-radius: 20rpx 0 20rpx 0;
				padding: 15rpx 20rpx;
			}
		}

		.nation {
			height: calc(100vh - 200rpx);

			.nation-title {
				height: 100rpx;

			}

			.chapter-list {
				.isVip {
					padding: 5rpx 15rpx;
					border-radius: 8rpx 0px 8rpx 0px;
					color: #A1562F;
					background: linear-gradient(270deg, #F3D1B1 0%, #E2A167 100%);
				}
			}
		}
	}

	.sort {
		width: 45rpx;
		height: 45rpx;
	}
</style>