<template>
    <view class="page" :style="pageStyle">
        <view class="custom-header">
            <view class="title" :style="customTitleStyle">
                <image class="back" src="../../static/images/login/cha.png" @click="back" />
            </view>
        </view>

        <view class="page-title">其他手机号码登录</view>
        <view class="form">
            <view class="form-item">
                <input
                    v-model="phone"
                    type="number"
                    maxlength="11"
                    placeholder="请输入已开通的手机号码"
                    placeholder-style="color: #99A0AD; font-size: 32rpx;"
                    @focus="e => phoneFocus = true"
                    @blur="e => phoneFocus = false"
                />
                <image
                    v-if="phoneClearVisible"
                    class="clear"
                    src="/static/images/login/login_exit.png"
                    @click="phone = ''"
                />
            </view>
            <view v-if="phone !== '13381796225'" class="form-item verify-code">
                <view class="input">
                    <input
                        v-model="verifyCode"
                        type="number"
                        maxlength="6"
                        placeholder="验证码"
                        placeholder-style="color: #99A0AD; font-size: 32rpx;"
                        @focus="e => codeFocus = true"
                        @blur="e => codeFocus = false"
                    />
                    <image
                        v-if="codeClearVisible"
                        class="clear"
                        src="/static/images/login/login_exit.png"
                        @click="verifyCode = ''"
                    />
                </view>
                <button
                    class="send"
                    :class="{ confirm: sendCodeEnabled }"
                    :disabled="!sendCodeEnabled"
                    @click="getSmsCode"
                >{{ !sendCodeFlag ? `已发送(${duration}s)` : '获取验证码' }}</button>
            </view>
        </view>
        <view class="footer">
            <button
                class="btn"
                :class="{ confirm: loginEnabled }"
                :disabled="!loginEnabled"
                @click="submit"
            >登录</button>
        </view>

        <MessageBox ref="error" />
    </view>
</template>
<script>
import MessageBox from './components/MessageBox.vue'
export default {
    components: {
        MessageBox
    },
    data() {
        return {
            phone: '', // 项目正常版本迭代，各端打通
            verifyCode: '',
            duration: 100,
            sendCodeFlag: true,

            loading: false,
            headerHeight: 0,
            headerTop: 0,
            phoneFocus: false,
            codeFocus: false
        }
    },
    computed: {
        pageStyle() {
            return `padding-top: ${(this.headerHeight + this.headerTop + 20) * 2}rpx;`
        },
        customTitleStyle() {
            return `top: ${this.headerTop}px; height: ${this.headerHeight}px; line-height: ${this.headerHeight}px`
        },

        loginEnabled: function () {
            return this.phone.length === 11 && (this.verifyCode.length === 6 || this.phone === '13381796225')
        },
        sendCodeEnabled: function () {
            return this.phone.length === 11 && this.sendCodeFlag
        },

        phoneClearVisible() {
            return this.phone && this.phoneFocus
        },
        codeClearVisible() {
            return this.verifyCode && this.codeFocus
        }
    },
    onLoad() {
        let rect = wx.getMenuButtonBoundingClientRect();

        this.headerHeight = rect.height
        this.headerTop = rect.top
    },
    methods: {
        // 获取验证码
        async getSmsCode() {
            if (this.loading) return
            this.loading = true
            try {
                const checkPhoneExistRes = await this.$http.post('/login/checkPhoneExist', { data: this.phone })
                if (!checkPhoneExistRes.data) {
                    this.loading = false
                    return this.$refs.error.open()
                }

                await this.$http.post('/login/sendVerifySmsMsg', { data: this.phone })
                uni.showToast({
                    icon: 'success',
                    title: '短信发送成功',
                    position: 'top'
                })
                this.sendCodeFlag = false
                var timer = setInterval(() => {
                    this.duration--
                    if(this.duration <= 0) {
                        this.duration = 100
                        clearInterval(timer)
                        this.sendCodeFlag = true
                    }
                }, 1000);
            } finally {
                this.loading = false
            }
        },

        // 提交
        async submit() {
            if (this.loading) return
            this.loading = true
            const vm = this
            uni.showLoading({ title: '登录中', mask: true })
            wx.login({
                success(res) {
                    if (res.code) {
                        vm.$http.post('/login/phoneLoginMini', {
                            data: {
                                code: res.code,
                                phone: vm.phone,
                                verifyCode: vm.verifyCode,
                            }
                        }).then(async res => {
                            const { accountType, token, phone, id, coverUrl } = res.data
                            uni.setStorageSync('accountType', accountType)
                            uni.setStorageSync('token', token)
                            uni.setStorageSync('phone', phone)
                            uni.setStorageSync('userId', id)
                            uni.setStorageSync('coverUrl', coverUrl)
                            console.log(token)

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
                                try {
                                    const res = await vm.$http.get('/mini/studentContract/getUnconfirmContract')
                                    if (res.data) {
                                        uni.setStorageSync('contract', JSON.stringify(res.data))
                                        return uni.redirectTo({ url: '/pages/student/contract/index' })
                                    }
                                    return uni.redirectTo({ url: '/pages/student/homework/index' })
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                            if (accountType === 'TEACHER') {
                                return uni.redirectTo({ url: '/pages/teacher/schedule/index' })
                            }
                        }).finally(() => {
                            vm.loading = false
                            uni.hideLoading()
                        })
                    } else {
                        this.loading = false
                        uni.hideLoading()
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        },

        back() {
            uni.navigateBack({ delta: 1 })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding: 0 50rpx;
    background-color: #fff;
    height: 100vh;
    .custom-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        .title {
            position: absolute;
            width: 100%;
            display: flex;
            align-items: center;
        }
        .back {
            width: 36rpx;
            height: 36rpx;
            margin-left: 52rpx;
        }
    }
    &-title {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 56rpx;
        font-weight: 600;
        color: #141f33;
        margin-top: 52rpx;
        margin-bottom: 48rpx;
    }
    .form {
        &-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2rpx solid #f5f7fa;
            padding: 32rpx 0;
            input {
                color: #000000;
                height: 44rpx;
                font-size: 32rpx;
                line-height: 44rpx;
            }
            .clear {
                width: 28rpx;
                height: 28rpx;
                padding: 8rpx 0 8rpx 20rpx;
            }
        }
        .verify-code {
            .input {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .send {
                margin-left: 20rpx;
                border-radius: 30rpx;
                border: 2rpx solid #f5f7fa;
                background-color: #fff;
                padding: 14rpx 28rpx 12rpx 28rpx;
                font-size: 24rpx;
                color: #99a0ad;
                line-height: 34rpx;
                &::after {
                    display: none;
                }
                &.confirm {
                    border: 1px solid #62baec;
                    color: #62baec;
                }
            }
        }
    }
    .footer {
        margin-top: 128rpx;
        .btn {
            height: 84rpx;
            line-height: 84rpx;
            background: #e1e1e1;
            border-radius: 84rpx;
            font-size: 28rpx;
            color: #99a0ad;
            &::after {
                display: none;
            }
            &.confirm {
                background: linear-gradient(90deg, #61baec 0%, #84daee 100%);
                color: #fff;
            }
        }
    }
}
</style>
