<template>
	<u-overlay :show="posterShow" @click="closePoster">
		<view class="share d-flex flex-column j-center a-center" @click.stop>
			<image :src="path" mode="widthFix" show-menu-by-longpress @longpress="show = true"></image>
			<view v-if="path" class="close mt-3 d-flex a-center j-center" @click="closePoster">
				<u-icon name="close" color="#fff" size="22"></u-icon>
			</view>
			<l-painter useCORS :after-delay="1000" :board="poster" :isCanvasToTempFilePath="canvasSwitch"
				@success="openSuccess" @fail="openFail" custom-style="position: fixed; left: 200%" />
		</view>
		<!-- 弹框 -->
		<m-modal :show="show" i18n title="温馨提示" @cancel="show = false" @confirm="saveConfirm">
			<view class="d-flex a-center j-center flex-column">
				<view class="d-flex a-center text-center j-center flex-column main-text-color letter-1">
					{{$t('确定要保存图片到本地相册吗？')}}
				</view>
			</view>
		</m-modal>
	</u-overlay>
</template>

<script>
	import MModal from '@/main_modules/main-ui/m-modal/index.vue'
	export default {
		name: "myShare",
		props: {
			posterShow: {
				type: [String, Boolean],
				default: false
			},
			item: Object,
			userInfo: Object,
			current: Number
		},
		components: {
			MModal
		},
		data() {
			return {
				path: '',
				oldPath: '',
				poster: {},
				canvasSwitch: false,
				show: false,
			};
		},
		watch: {
			posterShow: {
				handler(newV, oldV) {
					if (newV) {
						this.posterShowClick()
					}
				},
				deep: true
			},
			current: {
				handler(newV, oldV) {
					if (newV != oldV && this.posterShow) {
						uni.showLoading()
					} else if (newV == oldV && this.posterShow) {
						uni.hideLoading()
					}
				},
				deep: true
			}
		},
		methods: {
			//初始化
			init() {
				this.poster = {
					css: {
						width: "600rpx",
						height: "1000rpx",
						borderRadius: "15rpx",
						position: "relative",
						backgroundColor: "#E5ECF4"
					},
					views: [{
							src: `${this.item.picx}`,
							type: "image",
							css: {
								objectFit: "cover",
								width: "540rpx",
								height: "250rpx",
								marginLeft: "30rpx",
								marginTop: "30rpx",
								borderRadius: "15rpx",
							}
						},
						{
							text: `${this.item.name}`,
							type: 'text',
							css: {
								marginTop: '20rpx',
								fontWeight: 'bold',
								fontSize: '32rpx',
								marginLeft: '30rpx',
								display: 'inline-block'
							}
						},
						{
							text: `${this.item.score}`,
							type: 'text',
							css: {
								fontWeight: 'bold',
								color: '#EF930A',
								fontSize: '36rpx',
								position: "absolute",
								right: "30rpx",
								top: "300rpx",
							}
						},
						{
							text: `${this.$t('简介')}: ${this.item.text}`,
							type: 'text',
							css: {
								color: '#333',
								width: '540rpx',
								fontSize: '28rpx',
								marginTop: '20rpx',
								marginLeft: '30rpx',
								lineClamp: "9"
							}
						},
						{
							css: {
								width: "100%",
								height: "250rpx",
								position: "absolute",
								bottom: '0rpx',
								left: '0rpx',
								borderRadius: "15rpx",
								backgroundColor: '#fff'
							},
							views: [
								{
									src: '/static/img/common/avatar.png',
									type: "image",
									css: {
										objectFit: "cover",
										width: "100rpx",
										height: "100rpx",
										position: "absolute",
										left: "30rpx",
										top: "75rpx",
										borderRadius: "50%",
									}
								},
								{
									text: `${this.$t('书友')}: ${this.$store.state.userinfo.nichen ? this.$store.state.userinfo.nichen : this.$store.state.userinfo.name}`,
									type: "text",
									css: {
										objectFit: "cover",
										height: "50rpx",
										width: "250rpx",
										position: "absolute",
										left: "140rpx",
										top: "75rpx",
										fontSize: '26rpx',
										lineHeight: "50rpx",
										lineClamp: "1"
									}
								},,
								{
									text: `${this.$t('邀请您阅读')}《${this.item.name}》`,
									type: "text",
									css: {
										objectFit: "cover",
										height: "50rpx",
										width: "250rpx",
										position: "absolute",
										left: "140rpx",
										top: "125rpx",
										fontSize: '26rpx',
										lineHeight: "50rpx",
										lineClamp: "1"
									}
								},
								{
									text: `${this.item.share_url}`,
									type: 'qrcode',
									css: {
										objectFit: "cover",
										width: "150rpx",
										height: "150rpx",
										position: "absolute",
										right: "30rpx",
										top: "50rpx"
									}
								}
							],
							type: 'view'
						},
					]
				}
			},
			//关闭
			closePoster() {
				this.canvasSwitch = false
				this.poster = {}
				this.path = ''
				this.$emit('closePoster')
			},
			//分享按钮
			posterShowClick() {
				this.init()
				this.canvasSwitch = true
			},
			//生成海报成功
			openSuccess(e) {
				//console.log(e)
				this.$emit('success')
				uni.hideLoading()
				this.path = e
			},
			//生成海报失败
			openFail(e) {
				console.log(e)
				uni.$u.toast(e)
				uni.hideLoading()
			},
			//保存图片到相册
			saveConfirm() {
				this.$tools.Common.saveImageToPhotosAlbum(this.path, (e) => {
					if (e) {
						uni.showToast({
							title: this.$t('保存成功'),
							icon: 'none'
						})
					}else {
						uni.showToast({
							title: this.$t('保存失败'),
							icon: 'none'
						})
					}
					this.modalShow = false
					this.closePoster()
				})
			}
		}
	}
</script>

<style lang="scss">
	.share {
		width: 600rpx;
		border-radius: 20rpx;
		position: absolute;
		bottom: 50%;
		left: 75rpx;
		transform: translateY(50%);

		.close {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			border: 4rpx solid #fff;
		}
	}
</style>
