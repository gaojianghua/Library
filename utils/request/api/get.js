const {
	http
} = uni.$u

/**
 * get请求
 */
// 注销账号
export const cancellation = (params, config = {}) => http.get('/', {
	params
}, config)

// 获取书架
export const getBookShelf = (params, config = {}) => http.get('/index.php/hamr/fact/index', {
	params
}, config)

// 获取分类
export const getType = (params, config = {}) => http.get('/index.php/hamr/kxapps/type', {
	params
}, config)

// 获取历史
export const getBookHistory = (params, config = {}) => http.get('/', {
	params
}, config)

// 获取首页推荐
export const getHomeRecomm = (params, config = {}) => http.get('/index.php/hamr/cartoon/index', {
	params
}, config)

// 获取：猜你喜欢 更新 分类
export const getComicData = (params, config = {}) => http.get('/index.php/hamr/cartoon/data', {
	params
}, config)

// 获取历史
export const getMyReadData = (params, config = {}) => http.get('/index.php/hamr/cartoon/myread', {
	params
}, config)

// 修改密码
export const getUpdatePassword = (params, config = {}) => http.get('/index.php/hamr/record/pass', {
	params
}, config)

// 注册
export const getRegister = (params, config = {}) => http.get('/index.php/hamr/record/reg', {
	params
}, config)

// 获取用户信息
export const getUserInfo = (params, config = {}) => http.get('/index.php/hamr/account/index', {
	params
}, config)

// 修改密码
export const updatePassword = (params, config = {}) => http.get('/index.php/hamr/account/pass_edit', {
	params
}, config)

// 获取排行榜分类
export const getLeaderboard = (params, config = {}) => http.get('/index.php/hamr/cartoon/hottype', {
	params
}, config)

// 删除历史记录
export const getRemoveHistory = (params, config = {}) => http.get('/index.php/hamr/cartoon/myreaddel', {
	params
}, config)

// 获取广告内容
export const getAdsRow = (params, config = {}) => http.get('/index.php/hamr/initial/ads', {
	params
}, config)

// 获取VIP数据
export const getVIPData = (params, config = {}) => http.get('/index.php/hamr/money/init', {
	params
}, config)

// 开通VIP
export const getOpenVIP = (params, config = {}) => http.get('/index.php/hamr/money/save', {
	params
}, config)

// 获取用户协议或隐私政策
export const getAgreePolicy = (params, config = {}) => http.get('/index.php/hamr/initial/txt', {
	params
}, config)

// 获取系统联系方式
export const getSystemMessage = (params, config = {}) => http.get('/index.php/hamr/initial/kefu', {
	params
}, config)

// 获取详情
export const getDetail = (params, config = {}) => http.get('/index.php/hamr/cartoon/info', {
	params
}, config)

// 加入收藏
export const addCases = (params, config = {}) => http.get('/index.php/hamr/fact/add', {
	params
}, config)

// 取消收藏
export const delCases = (params, config = {}) => http.get('/index.php/hamr/fact/del/comic', {
	params
}, config)

// 获取章节
export const getChapterList = (params, config = {}) => http.get('/index.php/hamr/cartoon/chapter', {
	params
}, config)

// 获取章节内容
export const getChapterDetail = (params, config = {}) => http.get('/index.php/hamr/cartoon/read', {
	params
}, config)

// 生成订单
export const createOrder = (params, config = {}) => http.get('/index.php/hamr/money/order', {
	params
}, config)

// 支付验证
export const googlePayVerify = (params, config = {}) => http.get('/index.php/hamr/money/order_verify', {
	params
}, config)

// 国际区号列表
export const internationalAreaCodes = (params, config = {}) => http.get('/index.php/hamr/initial/callingprefix', {
	params
}, config)

// 获取IP地址
export const getIPCity = (params, config = {}) => http.get('/index.php/hamr/initial/getip', {
	params
}, config)

// 登录
export const login = (params, config = {}) => http.get('/index.php/hamr/record/index', {
	params
}, config)

// 删除阅读历史
export const delReadOld = (params, config = {}) => http.get('/index.php/hamr/cartoon/myreaddel', {
	params
}, config)

// 删除小说阅读历史
export const delNovelReadOld = (params, config = {}) => http.get('/index.php/hamr/novel/myreaddel', {
	params
}, config)

// 获取小说阅读历史
export const getNovelReadOld = (params, config = {}) => http.get('/index.php/hamr/novel/myread', {
	params
}, config)

// 获取小说数据
export const getNovelData = (params, config = {}) => http.get('/index.php/hamr/novel/data', {
	params
}, config)

// 删除小说书架
export const delNovelShelf = (params, config = {}) => http.get('/index.php/hamr/fact/del/book', {
	params
}, config)

// 获取小说书架
export const getNovelShelf = (params, config = {}) => http.get('/index.php/hamr/fact/book', {
	params
}, config)

// 获取小说排行榜分类
export const getNovelLeaderboardType = (params, config = {}) => http.get('/index.php/hamr/novel/hottype', {
	params
}, config)

// 获取小说到书架
export const addNovelShelf = (params, config = {}) => http.get('/index.php/hamr/fact/add/book', {
	params
}, config)

// 获取小说详情
export const getNovelDetail = (params, config = {}) => http.get('/index.php/hamr/novel/info', {
	params
}, config)

// 获取小说章节
export const getNovelChapterInfo = (params, config = {}) => http.get('/index.php/hamr/novel/read', {
	params
}, config)

// 获取小说章节列表
export const getNovelChapterList = (params, config = {}) => http.get('/index.php/hamr/novel/chapter', {
	params
}, config)

// 获取小说章节列表
export const getFeedbackList = (params, config = {}) => http.get('/index.php/hamr/feeling/index', {
	params
}, config)

// 获取意见详情
export const getFeedbackDetail = (params, config = {}) => http.get('/index.php/hamr/feeling/info', {
	params
}, config)

// 意见反馈
export const feedback = (params, config = {}) => http.get('/index.php/hamr/feeling/add', {
	params
}, config)

// 修改用户信息
export const editUserinfo = (params, config = {}) => http.get('/index.php/hamr/account/edit', {
	params
}, config)

// 修改用户信息（绑定手机跟邮箱）
export const editMobileEmail = (params, config = {}) => http.get('/index.php/hamr/account/save_edit', {
	params
}, config)

// 获取Banner
export const getBanner = (params, config = {}) => http.get('/index.php/hamr/initial/ads', {
	params
}, config)