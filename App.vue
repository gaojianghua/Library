<script>
	import {
		getAppStatusHeight
	} from '@/main_modules/app-init/index.js'
	import {
		getPhoneHeight,
		setNavbarHeight,
		getAppVersion
	} from '@/main_modules/app-init/index.js'
	export default {
		onLaunch: function() {
			getAppVersion()
			/**
			 * APP端
			 */
			// #ifdef APP-PLUS
			plus.globalEvent.addEventListener("attributionChanged", (e) => {
				console.log(e.data)
				// e.data
			});
			plus.globalEvent.addEventListener("eventTrackingSucceeded", (e) => {
				console.log(e.data)
				// e.data
			});
			plus.globalEvent.addEventListener("eventTrackingFailed", (e) => {
				console.log(e.data)
				// e.data
			});
			plus.globalEvent.addEventListener("sessionTrackingSucceeded", (e) => {
				console.log(e.data)
				// e.data
			});
			plus.globalEvent.addEventListener("sessionTrackingFailed", (e) => {
				console.log(e.data)
				// e.data
			});
			plus.globalEvent.addEventListener("launchReceivedDeeplink", (e) => {
				console.log(e.uri)
				// e.uri
			});
			// 开屏动画
			plus.navigator.closeSplashscreen();
			// 锁定屏幕方向
			plus.screen.lockOrientation("portrait-primary");
			// #endif
			/**
			 * 全端
			 */
			// 获取手机状态栏高度
			getAppStatusHeight()
			// 获取手机屏幕高度
			getPhoneHeight()
			// 设置自定义导航栏高度
			setNavbarHeight()
			// 隐藏原生底部导航
			// uni.hideTabBar({
			// 	animation: false
			// })
			// 获取通讯录数据
			// getContacts()
			/**
			 * 不包括小程序端
			 */
			// setTimeout(() => {
			// 	为tabbar的某一项上添加文本
			// 	uni.setTabBarBadge({
			// 		index: 1,
			// 		text: '31'
			// 	});
			// 	显示tabbar上某一项的红点
			// 	uni.showTabBarRedDot({
			// 		index: 3
			// 	});
			// }, 1000);
		},
		onShow: function() {
			console.log('App Show');
			this.$multiportApi.app.openAppPage('&', ':', 'id')
			// checkOpenPermission(this.globalData)
			// checkOpenService()
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	/* 引入官方样式库 */
	/* #ifndef APP-NVUE */
	@import url("./common/uni.css");
	/* #endif */
	/* 引入free样式库 */
	@import url("./common/main.css");
	/* 引入全局样式库 */
	@import url("./common/common.css");
</style>