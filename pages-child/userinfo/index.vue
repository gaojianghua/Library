<template>
	<view>
		<m-navbar iconColor="#fff" :borderBottom="false" textColor="#fff" :bgColor="$store.state.bgColor"
			:textStyle="{fontWeight: 'bold', fontSize: '32rpx'}" i18n value="page.个人信息">
		</m-navbar>
		<view class="px-3">
			<view class="menu-item py-3 d-flex a-center border-bottom main-border-color">
				<u-image radius="100" width="120rpx" height="120rpx" src="/static/img/common/avatar.png" mode="">
				</u-image>
				<view class="ml-2 d-flex flex-column">
					<view class="text-white">
						{{userInfo.nichen || userInfo.name}}
					</view>
					<view class="text-white">
						{{(userInfo.id-0) * 3 % 2 + 10000}}
					</view>
				</view>
			</view>
		</view>
		<view class="px-3">
			<view class="d-flex j-sb border-bottom main-border-color">
				<view class="d-flex a-center" style="color: #fff;width: 160rpx;">
					<text>{{$t('昵称')}}</text>
				</view>
				<view
					style="height: 108rpx;line-height: 108rpx;text-align: right;width: calc(100% - 160rpx);display: flex;justify-content: flex-end;"
					@click="show = true">
					<text v-if="userInfo.nichen" class="text-white">{{userInfo.nichen}}</text>
					<text v-else style="color: #999;">{{$t('请输入新昵称')}}</text>
					<u-icon color="#fff" name="arrow-right" size="28rpx"></u-icon>
				</view>
			</view>
			<view class="d-flex j-sb border-bottom main-border-color">
				<view class="d-flex a-center" style="color: #fff;width: 160rpx;">
					<text>{{$t('绑定手机号')}}</text>
				</view>
				<view
					style="height: 108rpx;line-height: 108rpx;text-align: right;width: calc(100% - 160rpx);display: flex;justify-content: flex-end;"
					@click="openMobileEmail(true)">
					<text v-if="userInfo.tel" class="text-white">{{userInfo.callingcode}}-{{userInfo.tel}}</text>
					<text v-else style="color: #999;">{{$t('请输入手机号')}}</text>
					<u-icon color="#fff" name="arrow-right" size="28rpx"></u-icon>
				</view>
			</view>
			<view class="d-flex j-sb">
				<view class="d-flex a-center" style="color: #fff;width: 160rpx;">
					<text>{{$t('绑定邮箱')}}</text>
				</view>
				<view
					style="height: 108rpx;line-height: 108rpx;text-align: right;width: calc(100% - 160rpx);display: flex;justify-content: flex-end;"
					@click="openMobileEmail(false)">
					<text v-if="userInfo.email" class="text-white">{{userInfo.email}}</text>
					<text v-else style="color: #999;">{{$t('请输入邮箱')}}</text>
					<u-icon color="#fff" name="arrow-right" size="28rpx"></u-icon>
				</view>
			</view>
		</view>
		<!-- 修改昵称 -->
		<m-modal :show="show" i18n title="修改昵称" @cancel="show = false" @confirm="confirmChangeUsername">
			<view id="info" class="d-flex a-center j-center">
				<u-input type="text" :placeholder="$t('请输入新昵称')" v-model="query.nichen">
					<view slot="prefix" class="area d-flex a-center mr-1">
						<u-icon name="account-fill" color="#6F43FE" size="24"></u-icon>
					</view>
				</u-input>
			</view>
		</m-modal>
		<!-- 绑定邮箱和手机号 -->
		<m-modal :show="mobileShow" i18n :title="isMobile ? '绑定手机号' : '绑定邮箱'" @cancel="mobileShow = false"
			@confirm="confirmChangeMobile">
			<view v-if="isMobile" class="d-flex a-center j-center">
				<u-input type="number" maxlength="12" :placeholder="$t('请输入手机号')" v-model="mobileQuery.mobile">
					<view slot="prefix" class="area d-flex a-center mr-3" @click="cityShow = true">
						<span class="mr-1">+{{mobileQuery.callingcode}}</span>
						<u-icon name="arrow-down-fill" color="#6F43FE" size="14"></u-icon>
					</view>
				</u-input>
			</view>
			<view v-else class="d-flex a-center j-center">
				<u-input type="text" maxlength="100" :placeholder="$t('请输入邮箱')" v-model="mobileQuery.email">
					<view slot="prefix" class="area d-flex a-center mr-1">
						<u-icon name="email-fill" color="#6F43FE" size="22"></u-icon>
					</view>
				</u-input>
			</view>
			<view class="d-flex a-center j-center mt-2">
				<u-input type="password" maxlength="16" :placeholder="$t('请输入密码')" v-model="mobileQuery.pass">
					<view slot="prefix" class="area d-flex a-center mr-1">
						<u-icon name="lock-fill" color="#6F43FE" size="24"></u-icon>
					</view>
				</u-input>
			</view>
			<view class="d-flex a-center j-center mt-2">
				<u-input type="password" maxlength="16" :placeholder="$t('请输入再次输入密码')" v-model="repass">
					<view slot="prefix" class="area d-flex a-center mr-1">
						<u-icon name="lock-fill" color="#6F43FE" size="24"></u-icon>
					</view>
				</u-input>
			</view>
		</m-modal>
		<m-popup :show="cityShow" :areaList="areaList" @close="cityShow = false" @switchArea="switchArea">
		</m-popup>
	</view>
</template>

<script>
	import MModal from '@/main_modules/main-ui/m-modal/index.vue'
	import MPopup from '@/components/m-popup.vue'
	import MCell from '@/main_modules/main-ui/m-cell/index.vue'
	import {
		requestData
	} from '@/utils/index.js'
	import {
		getUserInfo,
		editUserinfo,
		getRegister,
		editMobileEmail,
		internationalAreaCodes
	} from '@/utils/request/api/get.js'
	export default {
		components: {
			MModal,
			MPopup,
			MCell
		},
		data() {
			return {
				userInfo: {},
				show: false,
				mobileShow: false,
				cityShow: false,
				query: {
					nichen: '',
					type: 'nichen'
				},
				mobileQuery: {
					mobile: '',
					email: '',
					pass: '',
					callingcode: '852'
				},
				repass: '',
				areaList: [],
				isMobile: true
			}
		},
		onLoad() {
			this.getInternationalAreaCodes()
		},
		onShow() {
			this.get_userinfo()
		},
		methods: {
			// 获取国家代码
			async getInternationalAreaCodes() {
				let result = requestData({})
				let {
					data
				} = await internationalAreaCodes(result)
				data.forEach((item) => {
					this.areaList = this.areaList.concat(item)
				})
			},
			// 选择国家区号
			switchArea(i) {
				this.mobileQuery.callingcode = i.callingcode
				this.cityShow = false
			},
			// 打开绑定手机号或邮箱弹窗
			openMobileEmail(i) {
				if (i) {
					if (this.userInfo.tel) return
				} else {
					if (this.userInfo.email) return
				}
				this.isMobile = i
				this.mobileShow = true
			},
			// 提交绑定手机号或者邮箱
			async confirmChangeMobile() {
				if (this.isMobile) {
					if (!this.mobileQuery.mobile) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: this.$t('请输入手机号')
						});
						return false;
					}
					if (this.mobileQuery.mobile.length < 7 || this.mobileQuery.mobile.length > 12) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: this.$t('手机号长度应在7至12位之间')
						});
						return false;
					}
				} else {
					if (!this.mobileQuery.email) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: this.$t('请输入邮箱')
						});
						return false;
					}
					if (this.mobileQuery.email.indexOf('@') == -1) {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: this.$t('邮箱格式不正确')
						});
						return false;
					}
				}

				if (this.mobileQuery.pass.length < 6 || this.repass.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: this.$t('密码不能低于6位')
					});
					return false;
				}
				if (this.repass !== this.mobileQuery.pass) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: this.$t('两次密码输入不一致')
					});
					return false;
				}
				let result = requestData(this.mobileQuery)
				let {
					code,
					msg,
					token
				} = await editMobileEmail(result)
				this.mobileShow = false
				if (code == 1) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: msg
					});
					this.$store.commit('updateToken', token)
					uni.setStorageSync('token', token)
					this.get_userinfo()
				} else {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: msg
					});
				}
			},
			// 提交修改昵称
			async confirmChangeUsername() {
				let result = requestData(this.query)
				let {
					code,
					msg
				} = await editUserinfo(result)
				this.show = false
				if (code == 1) {
					uni.showToast({
						icon: 'none',
						title: msg
					})
					this.get_userinfo()
				} else {
					uni.showToast({
						icon: 'none',
						title: msg
					})
				}
			},
			// 获取用户信息
			async get_userinfo() {
				let result = requestData({})
				let {
					user
				} = await getUserInfo(result)
				this.userInfo = user
				this.$store.commit('updateUserinfo', user)
				uni.setStorageSync('userinfo', user)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menu-item {

		.user-info {
			height: 100rpx;

			.info-name {
				font-size: 30rpx;
				font-weight: 500;
			}

			.info-desc {
				font-size: 26rpx;
				font-weight: 400;
				color: #898989;
			}

			.user-notice {
				font-size: 26rpx;
				font-weight: 400;
				color: #999;
			}
		}

		.user-avatar {
			border-radius: 50%;
			overflow: hidden;
		}
	}
</style>