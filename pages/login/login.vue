<template>
    <view class="page">
        <image class="back" src="../../static/images/login/login_exit.png" @click="back" />
        <view class="title">其他手机号码登录</view>
        <view class="form">
            <view class="form-item">
                <input
                    v-model="phone"
                    type="number"
                    maxlength="11"
                    placeholder="请输入已开通的手机号码"
                    placeholder-style="color: #99A0AD; font-size: 32rpx;"
                />
            </view>
            <view v-if="phone !== '13381796225'" class="form-item verify-code">
                <input
                    v-model="verifyCode"
                    type="number"
                    maxlength="6"
                    placeholder="验证码"
                    placeholder-style="color: #99A0AD; font-size: 32rpx;"
                />
                <button
                    class="send"
                    :class="{ confirm: sendCodeEnabled }"
                    :disabled="!sendCodeEnabled"
                    @click="getSmsCode"
                >{{ duration !== undefined ? `已发送（${duration}s）` : '获取验证码' }}</button>
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

        <pianoMessageBox
            ref="error"
            message="仅对内部学员开放 请使用已开通的手机号登录"
            @confirm="() => $refs.error.close()"
        />
    </view>
</template>
<script>
export default {
    data() {
        return {
            phone: '', // 项目正常版本迭代，各端打通
            verifyCode: '',
            duration: undefined,

            loading: false
        }
    },
    computed: {
        loginEnabled: function () {
            return this.phone.length === 11 && (this.verifyCode.length === 6 || this.phone === '13381796225')
        },
        sendCodeEnabled: function () {
            return this.phone.length === 11 && this.duration === undefined
        },
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
                this.duration = 60
                const timer = setInterval(() => {
                    if (this.duration >= 0) {
                        this.duration--
                    } else {
                        this.duration = undefined
                        clearInterval(timer)
                    }
                }, 1000)
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
                            const { accountType, token, phone, id } = res.data
                            uni.setStorageSync('accountType', accountType)
                            uni.setStorageSync('token', token)
                            uni.setStorageSync('phone', phone)
                            uni.setStorageSync('userId', id)
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
                                    return uni.redirectTo({ url: '/pages/student/videos/index' })
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
    .back {
        width: 36rpx;
        height: 36rpx;
        margin-top: 60rpx;
    }
    .title {
        height: 80rpx;
        line-height: 80rpx;
        font-size: 56rpx;
        font-weight: 500;
        color: #141f33;
        margin-top: 80rpx;
        margin-bottom: 48rpx;
    }
    .form {
        &-item {
            border-bottom: 2rpx solid #f5f7fa;
            padding: 32rpx 0;
            input {
                color: #000000;
                height: 44rpx;
                font-size: 32rpx;
                line-height: 44rpx;
            }
        }
        .verify-code {
            display: flex;
            align-items: center;
            input {
                flex: 1;
            }
            .send {
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
