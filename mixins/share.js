export default {
	data() {
		return {
			posterShow: false,
			shareShow: false,
			isSuccess: false,
			time: null,
		}
	},
	onHide() {
		
	},
	methods: {
		// 分享方式
		shareMethods() {
			this.shareShow = true
		},
		// 复制链接
		copyLink() {
			uni.setClipboardData({
				data: this.detail.share_url,
				showToast:false,
				success: () => {
					uni.showToast({
						icon: 'none',
						title: this.$t('复制成功')
					})
				},
				fail: () => {
					uni.showToast({
						icon: 'none',
						title: this.$t('复制失败')
					})
				}
			})
			this.shareShow = false
		},
		//分享海报
		sharePoster() {
			this.posterShow = true
			uni.showLoading()
			this.time = setTimeout(() => {
				if(this.isSuccess) {
					uni.$u.toast(this.$t('网络异常，请稍后重试'))
					uni.hideLoading();
				}
				clearTimeout(this.time)
			}, 6000);
			this.shareShow = false
		},
		//生成海报成功
		success() {
			this.isSuccess = true
			clearTimeout(this.time)
		},
		//关闭弹框
		closePoster() {
			this.isSuccess = false
			this.posterShow = false
		}
	}
}