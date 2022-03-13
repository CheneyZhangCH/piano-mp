<template>
    <view class="page">
        数据中心
        <customTabbar :active="1" />
    </view>
</template>

<script lang="js">
export default {
    data() {
        return {
        }
    },
    onLoad() {
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
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
</style>
