<template>
    <view class="login-all-wrap">
        <image class="login-image" src="https://static.gangqintonghua.com/img/beijing/login-bg.png" />
        <view class="login-btn-wrap">
            <button open-type="getPhoneNumber" @getphonenumber="getUserPhoneNumber">
                <image src="https://static.gangqintonghua.com/img/icon/login-btn.png" />
            </button>
            <button @click="navToLogin">
                <image src="https://static.gangqintonghua.com/img/icon/other-login-btn.png" />
            </button>
        </view>

        <MessageBox ref="error" @confirm="errorConfirm" />
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
            loading: false,
        }
    },
    onReady() { },
    onLoad() { },
    methods: {
        async getUserPhoneNumber(e) {
            if (this.loading) return
            this.loading = true

            if (!e.detail?.code) {
                this.loading = false
                this.$toast({ title: '用户拒绝！', icon: 'none' })
                return
            }

            const vm = this
            wx.login({
                success(res) {
                    if (res.code) {
                        uni.showLoading({ title: '登录中', mask: true })
                        vm.$http
                            .post('/login/wechatPhoneLoginMini', {
                                data: {
                                    code: res.code,
                                    phoneCode: e.detail.code,
                                },
                            })
                            .then(async res => {
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
                            })
                            .catch((err) => {
                                // console.log(err, 'catch')
                                if (err.code === 4014) {
                                    vm.$refs.error.open()
                                }
                            })
                            .finally(() => {
                                vm.loading = false
                                uni.hideLoading()
                            })
                    } else {
                        this.loading = false
                        console.log('登录失败！' + res.errMsg)
                    }
                }
            })
        },

        navToLogin() {
            uni.navigateTo({ url: '/pages/login/login' })
        },

        errorConfirm() {
            uni.navigateTo({ url: '/pages/login/login' })
        }
    },
}
</script>

<style lang="scss" scoped>
.login-all-wrap {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}
.login-image {
    height: 100%;
    width: 100%;
}
.login-btn-wrap {
    position: fixed;
    top: 900rpx;
    left: 50%;
    transform: translateX(-50%);
    button {
        padding: 0;
        background: transparent;
        border: 0;
        line-height: 1;
        + button {
            margin-top: 58rpx;
        }
        &::after {
            display: none;
        }
        image {
            width: 350rpx;
            height: 88rpx;
        }
    }
}
</style>
