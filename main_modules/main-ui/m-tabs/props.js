module.exports = {
	tabs: {
		type: Array,
		default: () => {
			return []
		}
	},
	chooseIndex: {
		type: Number,
		default: 0
	},
	slideNum: {
		type: [String, Number],
		default: 1
	},
	scrollHeight: {
		type: String,
		default: '60rpx'
	},
	scrollWidth: {
		type: String,
		default: '100%'
	},
	scrollBgColor: {
		type: String,
		default: '#fff'
	},
	scrollStyle: {
		type: Object,
		default: () => {
			return {}
		}
	},
	height: {
		type: String,
		default: '60rpx'
	},
	width: {
		type: String,
		default: 'auto'
	},
	bgColor: {
		type: String,
		default: '#fff'
	},
	chooseBgColor: {
		type: String,
		default: '#28A1ED'
	},
	itemStyle: {
		type: Object,
		default: () => {
			return {}
		}
	},
	chooseTextStyle: {
		type: Object,
		default: () => {
			return {
				color: '#fff'
			}
		}
	},
	textStyle: {
		type: Object,
		default: () => {
			return {}
		}
	}
}
