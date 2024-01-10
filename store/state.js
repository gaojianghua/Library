export default {
	/**
	 * 系统相关数据
	**/
	phoneHeight: uni.getStorageSync('phoneHeight') || {},	//手机屏幕高度
	statusHeight: uni.getStorageSync('statusHeight') || 0, //系统状态栏高度
	miniProgramCapsule: uni.getStorageSync('miniProgramCapsule') || {}, //小程序胶囊信息
	navbarHeight: uni.getStorageSync('navbarHeight') || 44, //自定义顶部导航栏高度
	// #ifdef APP-PLUS
	tabbarHeight: 0,	// APP端底部导航栏高度
	// #endif
	// #ifndef APP-PLUS
	tabbarHeight: 50,	// 除了APP的其他端底部导航栏高度
	// #endif
	safariFitHeight: uni.getStorageSync('safariFitHeight') || 0, //Safari浏览器多出的高度
	lang: uni.getStorageSync('lang') || 'zh-Hant',	//国际化多语言
	/**
	 * 自定义 tabbar 数据
	**/
	tabbar: [{
			pagePath: 'pages/tabbar/home/index',
			iconPath: '/static/img/tabbar/home.png',
			selectedIconPath: '/static/img/tabbar/home-active.png',
			text: 'page.首页'
		},
		{
			pagePath: 'pages/tabbar/category/index',
			iconPath: '/static/img/tabbar/category.png',
			selectedIconPath: '/static/img/tabbar/category-active.png',
			text: 'page.分类'
		},
		{
			pagePath: 'pages/tabbar/bookshelf/index',
			iconPath: '/static/img/tabbar/bookshelf.png',
			selectedIconPath: '/static/img/tabbar/bookshelf-active.png',
			text: 'page.书架'
		},
		{
			pagePath: 'pages/tabbar/mine/index',
			iconPath: '/static/img/tabbar/mine.png',
			selectedIconPath: '/static/img/tabbar/mine-active.png',
			text: 'page.我的'
		}
	],
	/**
	 * 实际业务相关数据
	**/
	appName: 'io.hammer.com', // APP包名
	token: uni.getStorageSync('token') || '',	// 登录凭证
	userinfo: uni.getStorageSync('userinfo') || {},		// 用户信息
	sysConfig: uni.getStorageSync('config') || {},		// 业务系统配置
	liveCity: uni.getStorageSync('liveCity') || '',		// 所在城市
	contacts: uni.getStorageSync('contacts') || [],		// 通讯录数据
	deviceId: uni.getStorageSync('deviceId') || '', 	// 设备ID
	facility: uni.getStorageSync('facility') || '', 	// 设备信息
	bgColor: '#050B18', // 顶部导航背景色
	sybml: '$', // 货币符号
	nationInfo: {}, // 所在国家信息
	recommList: uni.getStorageSync('recommList') || [], // 搜索历史
	novelRecommList: uni.getStorageSync('novelRecommList') || [], // 小说搜索历史
	allType: uni.getStorageSync('allType') || [], // 所有分类
	appUpdateTimeSize: 28800000,
	appSystemInfo: uni.getStorageSync('appSystemInfo') || {}
}
