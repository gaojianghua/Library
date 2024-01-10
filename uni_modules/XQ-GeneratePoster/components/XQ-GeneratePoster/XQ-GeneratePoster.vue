<template>
	<view class="content">
		<!-- <u-mask :show="share_qrcode_flag" :zoom="false" :custom-style="{ background: 'rgba(0,0,0,.8)' }" :duration="0"> -->
		<u-overlay :show="share_qrcode_flag">
			<view class="sq_box">
				<view class="tz_box qrcode_box">
					<view class="close_box" @click="share_qrcode_flag = false"><u-icon name="close"
							color="#ffffff"></u-icon></view>
					<view class="share_qrcode">
						<canvas canvas-id="myCanvas"
							style="width: 690px;height:1040px; position: fixed;top: -10000px;"></canvas>
						<image @longpress="showSaveImgWin = true" style="width: 100%; height: 100%;"
							:src="canvasToTempFilePath"></image>
					</view>
				</view>
			</view>
		</u-overlay>
		<!-- </u-mask> -->

		<u-modal :show="showSaveImgWin" :content="$t('确定要保存图片吗')" @confirm="saveShareImg(canvasToTempFilePath)"
			@cancel="showSaveImgWin = false" :show-cancel-button="true"></u-modal>
	</view>
</template>

<script>
	import {
		pathToBase64
	} from 'image-tools'
	export default {
		name: 'XQGeneratePoster',
		data() {
			return {
				ratio: 1,
				ctx: null, // 创建canvas对象
				canvasToTempFilePath: null, // 保存最终生成的导出的图片地址
				openStatus: true, // 声明一个全局变量判断是否授权保存到相册
				share_qrcode_flag: false,
				showSaveImgWin: false //保存图片到相册
			};
		},

		methods: {
			share_qrcode(option) {
				if (option) {
					if (!this.canvasToTempFilePath) {
						this.createCanvasImage(option);
					}
					this.share_qrcode_flag = true;
				}
			},

			//获取图片信息
			downloadFileImg(url) {
				return new Promise(resolve => {
					uni.getImageInfo({
						src: url,
						success: res => {
							resolve(res.path);
						},
						fail: err => {
							console.log(err);
							uni.showToast({
								title: this.$t('网络错误请重试'),
								icon: 'loading'
							});
						}
					});
				});
			},
			// 生成海报
			async createCanvasImage(option) {
				// 点击生成海报数据埋点
				if (!this.ctx) {
					uni.showLoading({
						title: this.$t('生成中...')
					});
					// let code = this.downloadFileImg(option.codeUrl);
					// let cover = this.downloadFileImg(option.coverUrl);
					// let headImg = this.downloadFileImg(option.headUrl);
					let code
					let cover 
					let headImg
					await pathToBase64(option.codeUrl).then(e => {
						code = e
						// console.log('base64',filePath);
					})
					await pathToBase64(option.coverUrl).then(e => {
						cover = e
						// console.log('base64',filePath);
					})
					await pathToBase64(option.headUrl).then(e => {
						headImg = e
						// console.log('base64',filePath);
					})
					
					let bgUrl = '';
					if (option.bgUrl) {
						bgUrl = new Promise(resolve => {
							uni.downloadFile({
								//生成临时地址
								url: option.bgUrl,
								success: res => {
									resolve(res.tempFilePath);
								},
								fail: erros => {
									uni.showToast({
										title: this.$t('网络错误请重试'),
										icon: 'loading'
									});
								}
							});
						});
					}
					Promise.all([headImg, code, cover, bgUrl]).then(result => {
						const ctx = uni.createCanvasContext('myCanvas', this);
						let canvasWidthPx = 640 * this.ratio,
							canvasHeightPx = 1040 * this.ratio,
							avatarurl_width = 120, //绘制的头像宽度
							avatarurl_heigth = 120, //绘制的头像高度
							avatarurl_x = 40, //绘制的头像在画布上的位置
							avatarurl_y = 28, //绘制的头像在画布上的位置
							codeurl_width = 180, //绘制的二维码宽度
							codeurl_heigth = 180, //绘制的二维码高度
							codeurl_x = 70, //绘制的二维码在画布上的位置
							codeurl_y = 800, //绘制的二维码在画布上的位置
							coverurl_width = 610, //绘制的封面宽度
							coverurl_heigth = 350, //绘制的封面高度
							coverurl_x = 40, //绘制的封面在画布上的位置
							coverurl_y = 190; //绘制的封面在画布上的位置

						if (option.bgUrl) {
							ctx.drawImage(result[3], 0, 0, 690, 1040); // 背景图片需要本地
						} else {
							//绘制圆角矩形
							ctx.save();
							ctx.translate(0, 0);
							//绘制圆角矩形的各个边
							this.drawRoundRectPath(ctx, 690, 1040, 14);
							ctx.fillStyle = option.fillStyle || '#0688ff'; //若是给定了值就用给定的值否则给予默认值
							ctx.fill();
							ctx.restore();
						}

						// 白底
						ctx.setFillStyle('#ffffff');
						ctx.fillRect(25, 175, 640, 840);

						ctx.save(); // 先保存状态 已便于画完圆再用
						ctx.beginPath(); //开始绘制
						//先画个圆   前两个参数确定了圆心 （x,y） 坐标  第三个参数是圆的半径  四参数是绘图方向  默认是false，即顺时针
						ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y,
							avatarurl_width / 2, 0, Math.PI * 2, false);
						ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
						ctx.drawImage(result[0], avatarurl_x, avatarurl_y, avatarurl_width,
						avatarurl_heigth); // 推进去图片

						ctx.restore(); //恢复之前保存的绘图上下文状态 可以继续绘制

						ctx.font = 'normal bold 45px sans-serif';
						ctx.setFillStyle('#ffffff'); // 文字颜色
						if (option.nickName) {
							this.dealWords({
								ctx: ctx, //画布上下文
								fontSize: 45, //字体大小
								word: option.nickName, //需要处理的文字
								maxWidth: 480, //一行文字最大宽度
								x: 190, //文字在x轴要显示的位置
								y: 40, //文字在y轴要显示的位置
								maxLine: 1 //文字最多显示的行数
							});
						}
						ctx.setFillStyle('#ffffff'); // 文字颜色
						ctx.setFontSize(30); // 文字字号
						ctx.fillText(option.miniName, 190, 130); // 绘制文字

						ctx.setFillStyle('#222222');
						if (option.tkName) {
							this.dealWords({
								ctx: ctx, //画布上下文
								fontSize: 32, //字体大小
								word: option.tkName, //需要处理的文字
								maxWidth: 610, //一行文字最大宽度
								x: 40, //文字在x轴要显示的位置
								y: 550, //文字在y轴要显示的位置
								maxLine: 1 //文字最多显示的行数
							});
						}

						ctx.font = 'normal normal 26px sans-serif';
						ctx.setFillStyle('#555555'); // 文字颜色
						ctx.fillText('', 40, 670); // 绘制文字

						ctx.font = 'normal normal 26px sans-serif';
						ctx.setFillStyle('#555555'); // 文字颜色
						if (option.tkAuthor) {
							this.dealWords({
								ctx: ctx, //画布上下文
								fontSize: 26, //字体大小
								word: option.tkAuthor, //需要处理的文字
								maxWidth: 610, //一行文字最大宽度
								x: 40, //文字在x轴要显示的位置
								y: 590, //文字在y轴要显示的位置
								maxLine: 2 //文字最多显示的行数
							});
						}

						// 白底
						ctx.setFillStyle('#FDE5D2');
						ctx.fillRect(40, 690, 125, 40);

						ctx.setFillStyle('#F37F26'); // 文字颜色
						ctx.fillText(option.cost, 75, 720); // 绘制文字

						// 白底
						ctx.setFillStyle('#D2F1EF');
						ctx.fillRect(180, 690, 125, 40);

						ctx.setFillStyle('#2EBBB4'); // 文字颜色
						ctx.fillText(option.isPub, 195, 720); // 绘制文字

						// 白底
						ctx.setFillStyle('#CBE6FE');
						ctx.fillRect(320, 690, option.tkType.length * 30 + 15, 40);

						ctx.font = 'normal normal 24px sans-serif';
						ctx.setFillStyle('#1F8DFE'); // 文字颜色
						ctx.fillText(option.tkType, 340, 720); // 绘制文字

						ctx.beginPath();
						// 设置线宽
						ctx.lineWidth = 1;
						// 设置间距（参数为无限数组，虚线的样式会随数组循环）
						ctx.setLineDash([10, 10]);
						// 移动画笔至坐标 x20 y20 的位置
						ctx.moveTo(30, 760);
						// 绘制到坐标 x20 y100 的位置
						ctx.lineTo(660, 760);
						// 填充颜色
						ctx.strokeStyle = '#aaaaaa';
						// 开始填充
						ctx.stroke();
						ctx.closePath();

						ctx.font = 'normal normal 36px sans-serif';
						ctx.setFillStyle('#E65449'); // 文字颜色
						ctx.fillText(this.$t('长按识别'), 292, 870); // 绘制孩子百分比

						ctx.font = 'normal normal 36px sans-serif';
						ctx.setFillStyle('#222222'); // 文字颜色
						ctx.fillText(this.$t('二维码'), 436, 870); // 绘制孩子百分比

						ctx.font = 'normal normal 36px sans-serif';
						ctx.setFillStyle('#222222'); // 文字颜色
						ctx.fillText(this.$t('海量漫画小说免费看'), 292, 920); // 绘制孩子百分比

						ctx.drawImage(result[2], coverurl_x, coverurl_y, coverurl_width,
						coverurl_heigth); // 绘制封面
						ctx.drawImage(result[1], codeurl_x, codeurl_y, codeurl_width, codeurl_heigth); // 绘制头像
						ctx.draw(false, () => {
							// canvas画布转成图片并返回图片地址
							uni.canvasToTempFilePath({
									canvasId: 'myCanvas',
									width: 690,
									height: 1040,
									destWidth: 690,
									destHeight: 1040,
									success: res => {
										// console.log(res.tempFilePath)
										this.canvasToTempFilePath = res.tempFilePath;
										this.showShareImg = true;
										uni.showToast({
											title: this.$t('绘制成功')
										});
									},
									fail: err => {
										uni.showToast({
											title: this.$t('绘制失败')
										});
									},
									complete: () => {
										uni.hideLoading();
										uni.hideToast();
									}
								},
								this
							);
						});
					});
				}
			},

			drawRoundRectPath(cxt, width, height, radius) {
				cxt.beginPath(0);
				//从右下角顺时针绘制，弧度从0到1/2PI
				cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

				//矩形下边线
				cxt.lineTo(radius, height);

				//左下角圆弧，弧度从1/2PI到PI
				cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

				//矩形左边线
				cxt.lineTo(0, radius);

				//左上角圆弧，弧度从PI到3/2PI
				cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

				//上边线
				cxt.lineTo(width - radius, 0);

				//右上角圆弧
				cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);

				//右边线
				cxt.lineTo(width, height - radius);
				cxt.closePath();
			},
			//处理文字多出省略号显示
			dealWords(options) {
				options.ctx.setFontSize(options.fontSize); //设置字体大小
				let allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth); //实际总共能分多少行
				let count = allRow >= options.maxLine ? options.maxLine : allRow; //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
				let endPos = 0; //当前字符串的截断点
				for (let j = 0; j < count; j++) {
					let nowStr = options.word.slice(endPos); //当前剩余的字符串
					let rowWid = 0; //每一行当前宽度
					if (options.ctx.measureText(nowStr).width > options.maxWidth) {
						//如果当前的字符串宽度大于最大宽度，然后开始截取
						for (let m = 0; m < nowStr.length; m++) {
							rowWid += options.ctx.measureText(nowStr[m]).width; //当前字符串总宽度
							if (rowWid > options.maxWidth) {
								if (j === options.maxLine - 1) {
									//如果是最后一行
									options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) *
										40); //(j+1)*18这是每一行的高度
								} else {
									options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 40);
								}
								endPos += m; //下次截断点
								break;
							}
						}
					} else {
						//如果当前的字符串宽度小于最大宽度就直接输出
						options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 40);
					}
				}
			},

			// 保存到系统相册
			saveShareImg(canvasToTempFilePath) {
				uni.saveImageToPhotosAlbum({
					filePath: canvasToTempFilePath,
					success: () => {
						this.$u.toast(this.$t('保存成功，快去分享到朋友圈吧~'));
						this.showSaveImgWin = false
					},
					fail: () => {
						this.$u.toast(this.$t('保存失败~'));
						this.showSaveImgWin = false
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	.sq_box {
		display: flex;
		height: 100%;
		justify-content: center;
		color: #333333;
		padding: 60rpx;

		.tz_box {
			background-color: #ffffff;
			border-radius: 14rpx;
			padding: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			width: 100%;
			text-align: center;
			line-height: 50rpx;
			height: 60%;
			margin-top: auto;
			margin-bottom: auto;

			.close_box {
				position: absolute;
				left: 50%;
				bottom: -70rpx;
				border: 4rpx solid #ffffff;
				width: 60rpx;
				height: 60rpx;
				margin-left: -30rpx;
				border-radius: 50%;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.share_qrcode {
				width: 100%;
				height: 100%;
			}

			.tz_title {
				font-size: 34rpx;
				font-weight: 600;
			}

			.content_box {
				margin: 50rpx 0;
				text-align: left;

				.inf {
					font-weight: bold;
					font-size: 36rpx;

					.copy {
						font-weight: 0;
						color: rgb(85, 104, 147);
						font-size: 30rpx;
					}
				}
			}
		}

		.qrcode_box {
			padding: 0;
		}
	}
</style>