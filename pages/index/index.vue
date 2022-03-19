
<template>
    <view class="content"></view>
</template>

<script lang="js">
export default {
    data() {
        return {

        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')
        const accountType = uni.getStorageSync('accountType')
        console.log('token', token)
        console.log('accountType', accountType)

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
    },
    methods: {

    }
}
</script>