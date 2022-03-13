<template>
    <view class="page">
        <view>课后作业</view>
        <customTabbar :active="1" />
    </view>
</template>

<script lang="js">
import dayjs from "dayjs"
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
