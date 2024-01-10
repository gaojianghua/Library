const {
	http
} = uni.$u

/**
 * post请求
 */
// 获取APP版本号
export const getVersion = (params, config = {}) => http.post('/api/Version/getVersionInfo', params, config)

// 上传图片
export const uploadImage = (params, config = {}) => http.post('/index.php/appv1/opinion/upload', params, config)

