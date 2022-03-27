<template>
    <view class="page">
        <image class="icon" src="https://static.gangqintonghua.com/img/icon/success.png"></image>
        <view class="tip">
            学员信息修改成功
        </view>
        <view class="tip2">
            详细信息可在“学员详情”中查看
        </view>
        <button class="btn" @click="toAccount">我知道了</button>
    </view>
</template>

<script lang="js">
export default {
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
        toAccount() {
            uni.redirectTo({ url: '/pages/audition/account/index' })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #fff;
    text-align: center;
    padding-top: 216rpx;
    .icon {
        width: 118rpx;
        height: 118rpx;
        margin-bottom: 80rpx;
    }
    .tip {
        font-size: 32rpx;
        font-weight: 600;
        color: #141F33;
        line-height: 44rpx;
        margin-bottom: 36rpx;
    }
    .tip2 {
        font-size: 24rpx;
        color: #141F33;
        line-height: 34rpx;
        margin-bottom: 486rpx;
    }
    .btn {
        background: #E2F3FF;
        border-radius: 12rpx;

        padding: 14rpx 76rpx 18rpx;

        font-size: 32rpx;
        font-weight: 500;
        color: #62BBEC;
        line-height: 44rpx;
        margin: 0 230rpx;
        &::after {
            display: none;
        }
    }
}
</style>
