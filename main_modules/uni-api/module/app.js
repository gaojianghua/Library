import MString from '../../tools/string.js'
import Navigate from '../../tools/navigate.js'
export default {
	// 退出 APP
	exitApp() {
		let platform = uni.getSystemInfoSync().platform
		if (platform == 'ios') {
			plus.ios.import("UIApplication").sharedApplication().performSelector("exit")
		} else if (platform == 'android') {
			plus.runtime.quit();
		}
	},
	// 前往系统设置
	openSystemSettings() {
		if (plus.os.name === 'iOS') {
			plus.runtime.openURL("app-settings://");
		} else {
			let Intent = plus.android.importClass("android.content.Intent");
			let Settings = plus.android.importClass("android.provider.Settings");
			let Uri = plus.android.importClass("android.net.Uri");
			let mainActivity = plus.android.runtimeMainActivity();
			let intent = new Intent();
			intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
			let uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
			intent.setData(uri);
			mainActivity.startActivity(intent);
		}
	},
	/**
	 * @description 配置APP被唤醒至指定页面
	 * @param eleChar(string) 对象属性分隔符
	 * @param keyValueCahr(string) 键值对分隔符
	 * @param goodsId(string) 同一页面的商品id唯一标识名
	 */
	openAppPage(eleChar, keyValueCahr, goodsId) {
		const pages = getCurrentPages();
		const currentPage = pages[pages.length - 1];
		const route = currentPage && currentPage.route != undefined ? '/' + currentPage.route : ''
		let args = plus.runtime.arguments;
		let argsStr = args.split('//')[1];
		if (argsStr) {
			let argsObj = MString.convertStringToObject(argsStr, eleChar, keyValueCahr)
			if (route == argsObj.url && currentPage.$vm[goodsId] == argsObj[goodsId]) {
				return
			}else {
				let url = argsObj.url
				delete argsObj.url
				Navigate.navigateTo(url, argsObj, true)
			}
		}
	}
}