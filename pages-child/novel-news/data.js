const newTimes = [{
		name: '全部',
		date_type: 0,
		state: 1
	},
	{
		name: '今日',
		date_type: 1,
		state: 1
	},
	{
		name: '最近一周',
		date_type: 2,
		state: 1
	}
]

const completed = [{
		name: '全部',
		date_type: 0,
		state: 2
	},
	{
		name: '当月',
		date_type: 3,
		state: 2
	},
	{
		name: '半年',
		date_type: 4,
		state: 2
	},
	{
		name: '一年',
		date_type: 5,
		state: 2
	}
]

const tags = [{
		name: '综合',
		sort: 'score'
	},
	{
		name: '热门',
		sort: 'shits'
	},
	{
		name: '高分',
		sort: 'ticket'
	},
	{
		name: '最新',
		sort: 'addtime'
	}
]

module.exports = {
	newTimes,
	tags,
	completed
}