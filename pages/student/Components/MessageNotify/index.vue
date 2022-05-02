<template>
    <view class="notify" @click="toMessage">
        <image src="https://static.gangqintonghua.com/img/icon/notify.png" />
        <text v-if="msgCount > 0" class="count">{{ msgCount > 99 ? 99 : msgCount }}</text>
    </view>
</template>

<script>
export default {
    data() {
        return {
            msgCount: 0
        }
    },
    methods: {
        async getMsgCount() {
            try {
                const res = await this.$http.get('/mini/studentMsg/countUnread')
                this.msgCount = res.data ?? 0
            } catch (error) {
                console.log(error)
            }
        },

        toMessage() {
            uni.navigateTo({ url: '/pages/student/message/index' })
        }
    },
}
</script>

<style lang="scss" scoped>
.notify {
    position: fixed;
    right: 20rpx;
    bottom: 200rpx;
    z-index: 98;
    image {
        width: 96rpx;
        height: 96rpx;
    }
    .count {
        position: absolute;
        top: 20rpx;
        right: 20rpx;

        min-width: 24rpx;
        height: 24rpx;
        line-height: 24rpx;
        background: #f15e5e;
        border: 1px solid #ffffff;
        border-radius: 50%;
        text-align: center;

        font-size: 16rpx;
        font-weight: 600;
        color: #ffffff;
    }
}
</style>
