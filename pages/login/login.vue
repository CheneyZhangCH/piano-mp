<template>
    <view class="login-all-wrap">
        <view class="status_bar"></view>
        <image class="back-image" src="../../static/images/login/login_exit.png" @click="back" />
        <view class="title mb-48">其他手机号码登录</view>
        <view class="login-input-wrap">
            <view class="py-32 border-bottom">
                <input
                    v-model="phone"
                    type="number"
                    placeholder-style="color: #99A0AD"
                    placeholder="请输入已开通的手机号码"
                    @input="handlePhoneInput"
                />
            </view>
            <view class="verify-code-wrap py-32 flex align-stretch border-bottom">
                <input
                    v-model="verifyCode"
                    type="number"
                    placeholder-style="color: #99A0AD"
                    placeholder="验证码"
                    class="flex-1"
                    @input="handleCodeInput"
                />
                <view
                    class="send-code border flex align-center justify-center"
                    :class="{ 'show-code': sendCodeEnabled }"
                    @click="getSmsCode"
                >{{ duration !== undefined ? `已发送（${duration}s）` : '获取验证码' }}</view>
            </view>
        </view>
        <view class="login-btn-wrap py-2 px-2">
            <button
                enabled="loginEnabled"
                class="text-white"
                style="border-radius: 50rpx; border: 0;"
                type="primary"
                :class="{ 'bg-btn-main': loginEnabled, 'bg-btn-main-disabled': !loginEnabled }"
                @click="submit"
            >登录</button>
        </view>

        <uni-popup ref="popup">
            <view class="popup">
                <view v-if="false" class="popup-title">提示</view>
                <view class="popup-content flex flex-column align-center">
                    <view>仅对内部学员开放</view>
                    <view>请使用已开通的手机号登录</view>
                </view>
                <view class="popup-footer">
                    <button
                        class="bg-btn-main text-white"
                        style="border-radius: 50rpx; border: 0;"
                        type="primary"
                        @click="() => $refs.popup.close()"
                    >我知道了</button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>
<script>
// import uniStatusBar from '@/components/uni-ui/uni-status-bar/uni-status-bar.vue'
// import uniPopup from '@/components/uni-ui/uni-popup/uni-popup.vue'

// import uniPopupDialog from '@/components/uni-ui/uni-popup-dialog/uni-popup-dialog.vue'
// import { uniStatusBar } from '@dcloudio/uni-ui'

// const app = getApp()

export default {
    // components: { uniStatusBar, uniPopup },
    data() {
        return {
            phone: '',
            verifyCode: '',
            duration: undefined,
            canSentCode: false,

            jumpPage: '',
            keyword: '',

            unionid: '',
            nickName: '',
            avatar: '',

            loading: false,
            // canshowcode: false
        }
    },
    onReady: function () {
    },
    onLoad(option) {
        if (option.page !== '') {
            this.jumpPage = option.page
        }

        if (option.keyword !== '') {
            this.keyword = option.keyword
        }

        // const { statusBarHeight } = uni.getSystemInfoSync()
        // this.statusBarHeight = statusBarHeight
    },
    computed: {
        // enabled: function() { return !(this.username.length === 11 && this.password.length > 5) },
        loginEnabled: function () {
            return this.phone.length === 11 && this.verifyCode.length === 6
        },
        sendCodeEnabled: function () {
            return this.phone.length === 11 && this.duration === undefined
        },
    },
    methods: {
        handlePhoneInput(e) {
            this.canSentCode = e.detail.value.length === 11
        },
        handleCodeInput(e) {
            console.log('handleCodeInput', e.detail.value)
        },
        back() {
            uni.navigateBack({ delta: 1 })
        },
        // 获取验证码
        async getSmsCode() {
            if (this.phone.length !== 11 || this.duration !== undefined) return

            if (this.loading) return
            try {
                const checkPhoneExistRes = await this.$http.post('/login/checkPhoneExist', { data: this.phone })
                console.log(checkPhoneExistRes)
                if (!checkPhoneExistRes.ok || !checkPhoneExistRes.data) {
                    return this.$refs.popup.open()
                }

                const res = await this.$http.post('/login/sendVerifySmsMsg', { data: this.phone })
                console.log('res', res)
                if (res.ok) {
                    uni.showToast({
                        icon: 'success',
                        title: '短信发送成功',
                        position: 'top'
                    })
                    this.duration = 60
                    const timer = setInterval(() => {
                        if (this.duration >= 0) {
                            this.duration--
                        } else {
                            this.duration = undefined
                            clearInterval(timer)
                        }
                    }, 1000)
                }
            } finally {
                this.loading = false
            }
        },
        // 验证
        validate() {
            const mPattern = /^1[3456789][0-9]\d{8}$/
            if (!mPattern.test(this.phone)) {
                uni.showToast({
                    title: '手机号格式不正确',
                    icon: 'none',
                    duration: 2000
                })
                return false
            }
            // 更多验证
            return true
        },

        // 提交
        async submit() {
            if (!this.loginEnabled || this.loading) return
            this.loading = true
            const vm = this
            wx.login({
                success(res) {
                    console.log('wx.login', res);
                    if (res.code) {
                        vm.$http.post('/login/phoneLoginMini', {
                            data: {
                                code: res.code,
                                phone: vm.phone,
                                verifyCode: vm.verifyCode,
                            }
                        }).then(res => {
                            const { accountType, token, phone, id } = res.data
                            uni.setStorageSync('accountType', accountType)
                            uni.setStorageSync('token', token)
                            uni.setStorageSync('phone', phone)
                            uni.setStorageSync('userId', id)

                            // uni.navigateBack({ delta: 2 })
                            vm.$store.dispatch('tabBar/setTabbar', accountType) // 手动更新store

                            if (accountType === 'AUDITION') {
                                return uni.redirectTo({ url: '/pages/audition/index/index' })
                            }

                            if (accountType === 'SUPER_ADMIN') {
                                return uni.redirectTo({ url: '/pages/admin/index/index' })
                            }
                            if (accountType === 'ADMIN') {
                                return uni.redirectTo({ url: '/pages/admin/index/index' })
                            }
                            if (accountType === 'STUDENT') {
                                return uni.redirectTo({ url: '/pages/student/videos/index' })
                            }
                            if (accountType === 'TEACHER') {
                                return uni.redirectTo({ url: '/pages/teacher/schedule/index' })
                            }
                        }).finally(() => {
                            vm.loading = false
                        })
                    } else {
                        this.loading = false
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })


            // try {
            //   const res = await this.$http.post('/login/phoneLoginMini', {
            //     data: {
            //       phone: this.phone,
            //       verifyCode: this.verifyCode,
            //     }
            //   })
            //   console.log('handle login', res)
            //   const { accountType, token, phone, id } = res.data
            //   uni.setStorageSync('accountType', accountType)
            //   uni.setStorageSync('token', token)
            //   uni.setStorageSync('phone', phone)
            //   uni.setStorageSync('userId', id)
            //
            //   uni.navigateBack({ delta: 2 })
            // } finally {
            //   this.loading = false
            // }
        }
    }
}
</script>

<style lang="scss" scoped>
.login-all-wrap {
    padding: 0 50rpx;
    background-color: #fff;
    height: 100vh;
}

.back-image {
    width: 36rpx;
    height: 36rpx;
    margin-top: 60rpx;
}

.title {
    height: 80rpx;
    font-size: 56rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #141f33;
    line-height: 80rpx;
    margin-top: 80rpx;
}

.top-wrap button {
    display: inline-block;
    background-color: #ffffff;
    overflow: inherit;
}

button::after {
    border: none;
}

.captcha-login-btn,
.pass-login-btn {
    /* #ifndef H5 */
    margin-top: 80rpx;
    /* #endif */
    font-size: 30rpx;
    color: #646464;
}

.currentLogin {
    font-weight: bold;
    font-size: 44rpx;
}

/* 输入框部分 */
.login-input-wrap input {
    color: #000000;
    height: 44rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 44rpx;
}

.verify-code-wrap .send-code {
    position: relative;
    top: 4rpx;
    width: 176rpx;
    height: 60rpx;
    border-radius: 30rpx;
    border: 1rpx solid #f5f7fa;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #99a0ad;

    &.show-code {
        color: #62baec;
        border-color: #62baec;
    }
}

/*登录按钮部分*/
.login-btn-wrap {
    margin-top: 60rpx;
    height: 90rpx;
}

.login-btn-wrap button {
    font-size: 30rpx;
    height: 100%;
    line-height: 90rpx;
}

/* 登录按钮 输入内容时,去掉灰色效果 */
.login-btn {
    background: linear-gradient(to right, #7bd68e, #65ccb9);
}

.opatity {
    opacity: 0.5;
}

/* 登录图标 */
.login-icon-all-wrap {
    margin-top: 320rpx;
}

.login-icon {
    color: #60e28b;
    display: inline-block;
    width: 88rpx;
    height: 88rpx;
    text-align: center;
    line-height: 88rpx;
    font-size: 80rpx;
}

.qq-login-icon {
    color: #63c6ef;
}

.uni-tag-text--primary {
    margin: 0 60rpx;
}

.uni-tag-text--primary text {
    display: block;
}

.login-icon-text {
    color: #646464 !important;
}
</style>

<style lang="scss" scoped>
.popup {
    width: 622rpx;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 32rpx;
    padding: 48rpx 32rpx;

    .popup-content {
        width: 100%;
        font-size: 28rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #99a0ad;
        line-height: 42rpx;
    }

    .popup-footer {
        margin-top: 40rpx;
        //width: 323px;
        //height: 42px;
        //background: linear-gradient(90deg, #61BAEC 0%, #84DAEE 100%);
        //border-radius: 43px;
    }
}
</style>
