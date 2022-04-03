
<template>
</template>

<script lang="js">
export default {
    // onLoad() {
    //     const token = uni.getStorageSync('token')

    //     // 权限验证
    //     if (!token) {
    //         uni.showToast({
    //             title: '请先登录',
    //             icon: 'none'
    //         })
    //         return uni.navigateTo({
    //             url: '/pages/login/index'
    //         })
    //     }
    //     console.log(token)
    //     this.redirect()
    // },
    onShow() {
        const token = uni.getStorageSync('token')

        // 权限验证
        if (!token) {
            uni.showToast({
                title: '请先登录',
                icon: 'none'
            })
            return uni.navigateTo({
                url: '/pages/login/index'
            })
        }
        console.log(token)
        this.redirect()
    },
    methods: {
        async redirect() {
            const accountType = uni.getStorageSync('accountType')

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
                    const res = await this.$http.get('/mini/studentContract/getUnconfirmContract')
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
        }
    },
}
</script>
