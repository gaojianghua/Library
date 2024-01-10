<template>
	<view class="page">
		<m-navbar :borderBottom="false" :bgColor="$store.state.bgColor" isSlot>
			<view class="w-100 d-flex a-center search py-2 pl-7 pr-2">
				<!-- 搜索框 -->
				<u-search @change="searchChange" v-model="query.key" focus :placeholder="$t('请输入关键词')" height="60rpx"
					:showAction="false" @search="getSearchText" @clear="search_status=false"></u-search>
			</view>
		</m-navbar>
		<m-scroll :isLoading="isLoading" i18n :scrollStyle="scrollStyle" :load="load" bgColor="transparent"
			@loadmore="loadmore" @onRefresh="onRefresh">
			<view v-if="!isSearchResult && $store.state.recommList.length != 0" class="content p-3">
				<view class="recomm">
					<view class="recomm-title text-white d-flex a-center j-sb">
						<span>{{$t('搜索历史')}}</span>
						<u-icon name="trash" size="22" color="#6F43FE" @click="clearRecommList"></u-icon>
					</view>
					<view class="recomm-list d-flex flex-wrap">
						<view class="recomm-item d-flex a-center j-center mt-2 mr-2"
							v-for="(item, i) in $store.state.recommList" :key="i" @click="openSearch(item)">
							{{item}}
						</view>
					</view>
				</view>
			</view>
			<view v-if="!isSearchResult" class="content p-3">
				<view class="recomm">
					<view class="recomm-title text-white">
						{{$t('热门搜索')}}
					</view>
					<view class="recomm-list">
						<view class="rank-item mt-3 position-relative" v-for="(item, i) in hotsList" :key="i"
							@click="openDetail(item.id)">
							<view class="position-absolute d-flex top-0 mt-3 index-2" style="left: 0;">
								<view class="rank line-h flex-shrink mr-1"
									:style="{color: i == 0 ? '#F78F1E' : i == 1 ? '#9EB1C4' : i == 2 ? '#FAC4A9' : '#dfdfdf'}">
									{{i+1}}
								</view>
								<view class="position-relative mr-2">
									<u-image radius="6" width="215rpx" height="260rpx" :src="item.picx"></u-image>
									<view v-if="item.is_minors == 1"
										class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
										style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
										18
									</view>
								</view>
								<view class="d-flex flex-1 flex-column">
									<view class="d-flex a-center mt-1">
										<view class="item-name text-white line-h text-ellipsis1">
											{{item.name}}
										</view>
									</view>
									<view class="item-school mt-1">
										{{item.state}}
									</view>
									<view class="text-ellipsis2 item-type mt-1" style="width: 425rpx;">
										{{item.text}}
									</view>
								</view>
							</view>
							<view class="caed py-2 pr-3 j-around d-flex position-absolute left-0 w-100 index-1">
								<view class="caed-l j-sb flex-shrink d-flex a-center flex-column">
									<view class="line-h font" style="color: #77799A;">
										{{$t('评分')}}
									</view>
									<view class="d-flex a-center">
										<u-icon name="star-fill" size="20" color="#6F43FE"></u-icon>
										<view class="font-weight ml-1 line-h" style="color: #ED6824;">
											{{item.score}}{{$t('分')}}
										</view>
									</view>
								</view>
								<view class="caed-c mx-3"></view>
								<view class="caed-r d-flex a-center j-sb flex-column">
									<view class="line-h font" style="color: #77799A;">
										{{$t('作者')}}
									</view>
									<view class="text-white text-center auto-feed-letter font line-h">
										{{item.author}}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="isSearchResult" class="wrap">
				<view class="item">
					<u-empty class="pt-5" v-if="load != 0 && data.length == 0" mode="list" :text="$t('暂无数据')"
						icon="/static/img/common/white-empty.png">
					</u-empty>
					<view class="bookcard" v-if="data && data.length != 0">
						<view class="u-body-item position-relative" v-for="(item,index) in data" :key="index"
							@click="get_detail(item.id)">
							<view class="position-absolute d-flex top-0 mt-3 index-2" style="left: 30rpx;">
								<view class="position-relative mr-2">
									<u-image radius="6" width="215rpx" height="260rpx" :src="item.picx"></u-image>
									<view v-if="item.is_minors == 1"
										class="position-absolute font line-h top-0 right-0 py-1 px-1 text-white"
										style="border-radius: 0 10rpx 0 10rpx; background-color: #6F43FE;">
										18
									</view>
								</view>
								<view class="d-flex flex-1 flex-column">
									<view class="d-flex a-center mt-1">
										<view class="item-name text-white line-h text-ellipsis1">
											{{item.name}}
										</view>
									</view>
									<view class="item-school mt-1">
										{{item.state}}
									</view>
									<view class="text-ellipsis2 item-type mt-1" style="width: 425rpx;">
										{{item.text}}
									</view>
								</view>
							</view>
							<view class="caed py-2 pr-3 j-around d-flex position-absolute left-0 w-100 index-1">
								<view class="caed-l j-sb flex-shrink d-flex a-center flex-column">
									<view class="line-h font" style="color: #77799A;">
										{{$t('评分')}}
									</view>
									<view class="d-flex a-center">
										<u-icon name="star-fill" size="20" color="#6F43FE"></u-icon>
										<view class="font-weight ml-1 line-h" style="color: #ED6824;">
											{{item.score}}{{$t('分')}}
										</view>
									</view>
								</view>
								<view class="caed-c mx-3"></view>
								<view class="caed-r d-flex a-center j-sb flex-column">
									<view class="line-h font" style="color: #77799A;">
										{{$t('作者')}}
									</view>
									<view class="text-white text-center font line-h auto-feed-letter">
										{{item.author}}
									</view>
								</view>
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
		requestData
	} from '@/utils/index.js'
	import {
		getComicData,
		getNovelData
	} from '@/utils/request/api/get.js'
	export default {
		components: {
			MScroll
		},
		data() {
			return {
				hotsList: [],
				data: [],
				isLoading: false,
				load: 0,
				query: {
					page: 1,
					size: 10,
					key: '',
					sort: 'hits'
				},
				id: 1,
				total: 0,
				istrig: true,
				isSearchResult: false
			}
		},
		onLoad(options) {
			this.id = options.item
			this.getSearchStaticData()
		},
		methods: {
			async getSearchStaticData() {
				this.query.key = ''
				let result = requestData(this.query)
				let res
				if (this.id == 1) {
					res = await getComicData(result)
				} else if (this.id == 2) {
					res = await getNovelData(result)
				}
				this.hotsList = res.list
				this.isLoading = false
			},
			openDetail(i) {
				if (this.id == 0) {
					uni.navigateTo({
						url: '/pages-child/comic-detail/index?id=' + i
					})
				} else {
					uni.navigateTo({
						url: '/pages-child/novel-detail/index?id=' + i
					})
				}
			},
			openSearch(e) {
				this.query.key = e
				this.isLoading = true
				this.getSearchText()
			},
			// 搜索内容变化
			searchChange(e) {
				if (!e) {
					this.isSearchResult = false
				}
			},
			// 清空历史记录
			clearRecommList() {
				if (this.id == 1) {
					this.$store.commit('updateRecommList', [])
					uni.setStorageSync('recommList', [])
				} else if (this.id == 2) {
					this.$store.commit('updateNovelRecommList', [])
					uni.setStorageSync('novelRecommList', [])
				}
			},
			get_detail(name) {
				if (this.id == 1) {
					uni.navigateTo({
						url: '/pages-child/comic-detail/index?id=' + name
					})
				} else if (this.id == 2) {
					uni.navigateTo({
						url: '/pages-child/novel-detail/index?id=' + name
					})
				}
			},

			getSearchText(e) {
				if (!this.query.key || this.query.key.trim() === '') {
					return uni.showToast({
						title: this.$t('请输入关键词'),
						icon: 'none'
					});
				}

				if (this.id == 1) {
					let arr = this.$store.state.recommList
					if (!arr.includes(this.query.key)) {
						arr.push(this.query.key)
					}
					this.$store.commit('updateRecommList', arr)
					uni.setStorageSync('recommList', arr)
					this.get_cartoon_list()
				} else {
					let arr = this.$store.state.novelRecommList
					if (!arr.includes(this.query.key)) {
						arr.push(this.query.key)
					}
					this.$store.commit('updateNovelRecommList', arr)
					uni.setStorageSync('novelRecommList', arr)
					this.get_novel_list()
				}
				this.isSearchResult = true
			},

			async get_cartoon_list(e) {
				this.query.sort = ''
				let result = requestData(this.query)
				let {
					list,
					code,
					nums
				} = await getComicData(result)
				if (code == 1) {
					if (e) { // 加载更多
						this.data = this.data.concat(list)
					} else {
						this.data = list
					}
					if (this.query.page * this.query.size >= nums) {
						return this.load = 1
					} else {
						return this.load = 2
					}

				}
			},

			async get_novel_list(e) {
				this.query.sort = ''
				let result = requestData(this.query)
				let {
					list,
					code,
					nums
				} = await getNovelData(result)
				if (code == 1) {
					if (e) { // 加载更多
						this.data = this.data.concat(list)
					} else {
						this.data = list
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
				this.isLoading = true
				this.query.page = 1
				this.id == 1 ? this.get_cartoon_list() : this.get_novel_list()
			},
			// 加载更多
			loadmore() {
				if (this.load == 1 || this.istrig == false) return;
				this.load = 0
				this.query.page++
				this.istrig = false
				// this.isLoading = true
				let time = setTimeout(() => {
					this.id == 1 ? this.get_cartoon_list('S') : this.get_novel_list('S')
					this.istrig = true
					clearTimeout(time)
				}, 1000)
			},
		},
		computed: {
			scrollStyle() {
				return {
					height: `calc(100vh - ${this.$store.state.navbarHeight}px - env(safe-area-inset-bottom) - ${this.$store.state.statusHeight}px)`
				}
			}
		},
		watch: {
			isSearchResult: {
				handler(nv, ov) {
					nv ? this.isLoading = true : this.isLoading = false
				},
				immediate:true,
				deep: true
			}
		}
	}
</script>

<style scoped lang="scss">
	.page {

		// background-color: #fff;
		.content {

			.recomm {
				.recomm-title {
					font-size: 32rpx;
					font-weight: 500;
				}

				.recomm-list {
					.recomm-item {
						background: #1F2430;
						color: #ddd;
						font-size: 26rpx;
						padding: 2rpx 22rpx;
						border-radius: 4rpx;
					}

					.rank-item {
						height: 330rpx;

						.caed-c {
							height: 70rpx;
							width: 2rpx;
							background-color: #6F43FE;
						}

						.caed {
							height: 106rpx;
							bottom: 0;
							background-color: #222443;
							border-radius: 8rpx;
							padding-left: 276rpx;
						}
					}

					.rank-item:first-child {
						margin-top: 0 !important;
					}
				}
			}
		}
	}

	.item-name {
		font-size: 32rpx;
		font-weight: 400;
	}

	.item-mark {
		font-size: 32rpx;
		color: #ED6824;
	}

	.item-intro {
		width: 512rpx;
	}

	.item-intro,
	.item-type {
		color: #999;
		font-size: 24rpx;
	}

	.item-school {
		color: #0A57D0;
		font-size: 24rpx;
	}

	.u-body-item {
		height: 330rpx;

		.caed-c {
			height: 70rpx;
			width: 2rpx;
			background-color: #6F43FE;
		}

		.caed {
			height: 106rpx;
			bottom: 0;
			background-color: #222443;
			border-radius: 8rpx;
			padding-left: 276rpx;
		}

	}
</style>