# 好用记得5星好评噢

# 使用方法

```javascript
<template>
	<view>
		<u-button type="primary" @click="share_qrcode()">生成海报</u-button>
		<!-- <xq-generate-poster ref="draw" /> -->
		<XQ-GeneratePoster ref="draw" />
	</view>
</template>

<script>
// import XqGeneratePoster from '@/components/XQGeneratePoster.vue';
// import XqGeneratePoster from '@/uni_modules/XQ-GeneratePoster/components/XQ-GeneratePoster/XQ-GeneratePoster.vue';
export default {
	// components: { XqGeneratePoster },
	data() {
		return {
			option: {
				//绘制海报内容
				codeUrl: 'https://pic1.zhimg.com/80/v2-2714df42147132464a71af391ed04be4_720w.jpg', //小程序太阳码
				// codeUrl: '/static/tym.jpg', //小程序太阳码
				coverUrl: 'https://pic1.zhimg.com/80/v2-2714df42147132464a71af391ed04be4_720w.jpg', //题库图片
				headUrl: 'https://pic1.zhimg.com/80/v2-b9df1fdfe67f2177d5c84af90dcadfc1_720w.jpg?source=1940ef5c', //头像
				bgUrl: 'https://pic3.zhimg.com/v2-8fbde0f9ac6a19a23aa839e73394618a_b.jpg', //图片背景填充，和 fillStyle 只能传一个，bgUrl 优先级高于 fillStyle
				fillStyle: '#0688ff', //纯色背景填充颜色
				nickName: 'UNDEFINED', //授权登录的用户名
				miniName: '答题考试助手', //小程序名称
				tkName:'题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称题库名称~~', //题库名称
				tkAuthor:'题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者题库作者', //题库作者
				tkType: '考试', //题库类型
				cost: '免费', //是否需要收费   免费/付费
				isPub: '公开' //公开 还是 私有
			}
		};
	},
	methods: {
		share_qrcode() {
			this.$refs.draw.share_qrcode(this.option);
		}
	}
};
</script>

<style lang="scss" scoped></style>
```

项目中集成了 uview 可以自己集成一下，或者替换成自己的 ui 库～

[uview@1.x 官网](https://v1.uviewui.com/components/intro.html)

交流微信：xuqssqx