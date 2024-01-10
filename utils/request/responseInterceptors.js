import { intercept } from '@/main_modules/request/index.js'
/**
 * 响应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
	uni.$u.http.interceptors.response.use((response) => {
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		console.log(response)
		// intercept.errorMessage(response)
		if(response.data.code != 1 && response.data.code != 0) {
			uni.$u.toast(response.data.msg)
		}
		/* 返回成功数据 */
		return response.data || {}
	}, (response) => {
		/*  对响应错误做点什么 */
		uni.$u.toast('網絡異常，請稍後重試')
		// intercept.errorMessage(response)
		/* 返回错误数据 */
		return Promise.reject(response)
	})
}
