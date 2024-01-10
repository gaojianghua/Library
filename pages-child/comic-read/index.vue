<template>
	<view class="page">
		<!-- 遮罩层 -->
		<control-menu :show="show" :detail="detail" :chapterInfo="chapterInfo" @close="show = false" @pageBack="pageBack" @openDown="openDown" @openControls="openControls"
			@openUp="openUp" @openCollect="openCollect" @sharePosters="shareMethods"/>
		<!-- 内容区域 -->
		<m-scroll bgColor="transparent" i18n :isLoading="isLoading" :scrollStyle="scrollStyle" :load="load"
			@loadmore="loadmore" @onRefresh="onRefresh">
			<view @click="show = true">
				<view v-if="list.length != 0 && $store.state.userinfo.vip == chapterInfo.vip">
					<view class="list-item d-flex flex-column" v-for="(item, i) in list" :key="i">
						<u-image class="d-block" :src="item.picx" width="100vw" height="100%" mode="widthFix">
							<view slot="loading" class="d-flex a-center j-center">
								<u-loading-icon></u-loading-icon>
							</view>
						</u-image>
					</view>
				</view>
				<view class="d-flex a-center j-center flex-column" style="height: 100vh;" v-if="$store.state.userinfo.vip == 0 && chapterInfo.vip == 1">
					<view class="main-text-color font-lg">
						{{$t('当前为VIP章节，请先开通VIP')}}
					</view>
					<view class="mt-2 rounded-1 py px-5 text-white" style="background-color: #764BFF;" @click.stop="$tools.Navigate.navigateTo('/pages-child/member-recharge/index')">
						{{$t('去开通VIP')}}
					</view>
				</view>
			</view>
		</m-scroll>
		<!-- 海报弹框 -->
		<mine-app-share @closePoster="closePoster" @success="isSuccess" :posterShow="posterShow" :item="detail" />
		<!-- 分享方式 -->
		<share-mthods :show="shareShow" @close="shareShow = false" @copyLink="copyLink" @sharePoster="sharePoster" />
		<!-- 弹出层 -->
		<directory :show="directoryShow" :chapterList="chapterList" :detail="detail" :chapterId="query.chapterId" @close="directoryShow = false" @openSort="openSort" @openChapter="openChapter" />
		<!-- 弹框 -->
		<m-modal :show="modalShow" i18n title="温馨提示" confirmName="加入书架" @cancel="cancel" zIndex="11" @confirm="addCollect">
			<view class="d-flex a-center j-center flex-column">
				<view class="d-flex a-center text-center j-center flex-column main-text-color letter-1">
					{{$t('喜欢这本书吗？快加入书架吧！')}}
				</view>
			</view>
		</m-modal>
		<!-- 弹框 -->
		<m-modal :show="collShow" i18n title="温馨提示"  @cancel="collShow = false" zIndex="11" @confirm="delCollect">
			<view class="d-flex a-center j-center flex-column">
				<view class="d-flex a-center text-center j-center flex-column main-text-color letter-1">
					{{$t('确定要取消收藏吗？')}}
				</view>
			</view>
		</m-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import MScroll from '@/main_modules/main-ui/m-scroll/index.vue'
	import MModal from '@/main_modules/main-ui/m-modal/index.vue'
	import MineAppShare from '@/components/mine-app-share/index.vue'
	import ShareMthods from '@/components/share-methods/index.vue'
	import Directory from './comics-modules/directory/index.vue'
	import ControlMenu from './comics-modules/control-menu/index.vue'
	import share from '@/mixins/share.js'
	import {
		requestData
	} from '@/utils/index.js'
	import {
		getAdsRow,
		delCases,
		addCases,
		getChapterDetail,
		getChapterList
	} from '@/utils/request/api/get.js'
	export default {
		mixins: [share],
		components: {
			MScroll,
			MModal,
			MineAppShare,
			ShareMthods,
			Directory,
			ControlMenu
		},
		data() {
			return {
				show: false,
				posterShow: false,
				directoryShow: false,
				isSuccess: false,
				modalShow: false,
				collShow: false,
				detail: {},
				load: 0,
				list: [],
				chapterList: [],
				chapterIndex: 0,
				isLoading: true,
				query: {
					zid: 0,
					mid: 0
				},
				istrig: true,
				chapterInfo: {},
				poster: {},
				time: null,
				id: 0
			}
		},
		onLoad(options) {
			this.query.mid = options.book_id
			this.id = options.id
			this.init()
		},
		methods: {
			// 初始化
			init() {
				// this.query.inviteCode = this.item.inviteCode && this.item.inviteCode
				this.getChapterList()
				this.getData()
				this.getAds()
			},
			async getAds() {
				let result = requestData({})
				let {
					data
				} = await getAdsRow(result)
				this.ads = data[0]
			},
			// 退出当前页面
			pageBack() {
				if (this.detail.fav == 1) {
					this.$tools.Navigate.navigateBack()
				} else {
					this.modalShow = true
				}
			},
			// 获取章节列表
			async getChapterList() {
				if (this.id != undefined) {
					this.query.zid = this.id
				}
				let result = requestData({
					id: this.query.mid
				})
				let {
					code,
					list
				} = await getChapterList(result)
				if (code == 1) {
					this.chapterList = list
					if (this.id) {
						this.chapterList.forEach((item, i) => {
							if(item.id == this.query.zid) {
								this.chapterIndex = i
							}
						})
					}
					if (this.chapterList.length == 0) {
						uni.navigateBack({})
						uni.showToast({
							icon: 'none',
							title: this.$t('章节还未更新')
						})
					} else {
						if (this.query.zid !== 0) {
							this.getData()
						} else {
							this.query.zid = list[0].id
							this.getData()
						}
					}
				}
			},
			// 打开目录
			openControls() {
				uni.showLoading()
				let time = setTimeout(() => {
					this.directoryShow = true
					uni.hideLoading()
				}, 300)
			},
			// 打开指定章节
			openChapter(item) {
				this.query.zid = item.id
				this.chapterIndex = item.i
				this.refreshChapter()
				this.directoryShow = false
			},
			// 收藏
			async addCollect() {
				let result = requestData({
					id: this.query.mid
				})
				let { code } = await addCases(result)
				if (code == 1) {
					this.detail.fav = 1
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: this.$t("已收藏成功"),
						complete: () => {
							let time = setTimeout(() => {
								if (this.modalShow) {
									this.$tools.Navigate.navigateBack()
								}
								clearTimeout(time)
							}, 1000)
						}
					})
				}
			},
			// 取消收藏
			async delCollect() {
				let result = requestData({
					ids: this.query.mid
				})
				let { code } = await delCases(result)
				if (code == 1) {
					this.detail.fav = 0
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: this.$t("已取消收藏")
					})
					this.collShow = false
				}
			},
			// 收藏或者取消收藏
			async openCollect() {
				this.detail.fav == 0 ? this.addCollect() : this.collShow = true
			},
			// 获取数据
			async getData() {
				console.log(this.chapterIndex)
				let result = requestData(this.query)
				let {
					code,
					data
				} = await getChapterDetail(result)
				if (code == 1) {
					this.chapterInfo = data
					this.detail = data.comic
					this.list = data.piclist
					console.log(this.list)
					if (this.chapterIndex >= this.chapterList.length - 1) {
						return this.load = 1
					} else {
						return this.load = 2
					}
				}
			},
			// 加载更多
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.chapterIndex++
				this.query.zid = this.chapterList[this.chapterIndex].id
				this.istrig = false
				let time = setTimeout(() => {
					this.getData()
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
			// 下拉刷新
			onRefresh() {
				if (this.chapterIndex == 0) {
					return this.$refs.uToast.show({
						message: this.$t('已经是第一回'),
						type: 'warning',
						duration: 1200
					})
				}
				this.chapterIndex--
				this.query.zid = this.chapterList[this.chapterIndex].id
				this.getData()
			},
			// 刷新章节
			refreshChapter() {
				this.show = false
				this.getData()
			},
			// 上一回
			openUp() {
				if (this.chapterIndex == 0) {
					return this.$refs.uToast.show({
						message: this.$t('已经是第一回'),
						type: 'warning',
						duration: 1200
					})
				}
				this.chapterIndex--
				this.query.zid = this.chapterList[this.chapterIndex].id
				this.refreshChapter()
			},
			// 下一回
			openDown() {
				if (this.chapterIndex >= this.chapterList.length - 1) {
					return this.$refs.uToast.show({
						message: this.$t('已经是最后一回'),
						type: 'warning',
						duration: 1200
					})
				}
				this.chapterIndex++
				this.query.zid = this.chapterList[this.chapterIndex].id
				this.refreshChapter()
			},
			//排序切换
			openSort() {
				this.chapterList = this.chapterList.reverse()
			},
			// 取消
			cancel() {
				this.modalShow = false
				this.$tools.Navigate.navigateBack()
			}
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - env(safe-area-inset-bottom))`
				}
			},
			userinfo() {
				return this.$store.state.userinfo
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>