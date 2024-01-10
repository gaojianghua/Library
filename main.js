import App from './App.vue'
import Vue from 'vue'
import './.env'
// 多语言
import messages from './locale/index'
let i18nConfig = {
	locale: uni.getLocale() != 'zh-Hant' ? 'zh-Hant' : uni.getLocale(),
	messages
}
uni.setStorageSync('lang', 'zh-Hant')
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
export const i18n = new VueI18n(i18nConfig)
// 直接引入实例对象进行挂载
import http from '@/main_modules/request/method.js'
import store from '@/store';
import tools from '@/main_modules/tools/index.js'
import check from '@/main_modules/check/index.js'
import multiportApi from '@/main_modules/uni-api/index.js'
Vue.prototype.$http = http
Vue.prototype.$store = store
Vue.prototype.$tools = tools
Vue.prototype.$check = check
Vue.prototype.$multiportApi = multiportApi
// 通过 install 函数挂载 Vue 原型方法
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
// 环境设置
Vue.config.productionTip = false
// 全局过滤器挂载
import filters from '@/main_modules/filters'
Object.keys(filters).forEach((item, i) => {
	Object.keys(filters[item]).forEach(key => {
		Vue.filter(key, filters[item][key])
	})
})
// 全局引入组件
import MNavbar from '@/main_modules/main-ui/m-navbar/index.vue'
Vue.component('m-navbar', MNavbar)
import MTop from '@/main_modules/main-ui/m-top/index.vue'
Vue.component('m-top', MTop)
// 初始化 Vue 实例
App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
	...App
})
// 引入 uView 的请求封装
require('./utils/request/index')(app)
app.$mount()
// 生产环境去除打印
uni.uniEnv === 'Pro' ? console.log = () => {} : ''