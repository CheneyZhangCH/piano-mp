
<template>
    <view class="page">

    </view>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
    },
    methods: {

    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
}
</style>

