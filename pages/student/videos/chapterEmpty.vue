<template>
    <view class="page">
        <image src="https://static.gangqintonghua.com/img/kong/chapterEmpty.png" class="image"/>
        <view class="desc">我们正在抓紧拍摄中…</view>
        <view class="desc">在此期间，可联系老师为您提供弹奏视频</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            chapter: null,
        }
    },
    onLoad(option) {
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

        uni.setNavigationBarTitle({
            title: option.chapterName
        })
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding-top: 224rpx;
    text-align: center;
    .image {
        width: 352rpx;
        height: 318rpx;
        margin-bottom: 116rpx;
    }
    .desc {
        font-size: 14px;
        color: #99A0AD;
        line-height: 40rpx;
        margin-bottom: 16rpx;
        text-align: center;
    }
}
</style>
