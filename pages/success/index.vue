<template>
    <view class="page" :class="from">
        <image v-if="icon[from]" class="icon" :src="`https://static.gangqintonghua.com/img/icon/${icon[from]}.png`" />
        <view class="title">{{ title[from] }}</view>
        <view v-if="subTitle[from]" class="sub-title">{{ subTitle[from] }}</view>
        <button class="btn" @click="back">我知道了</button>
    </view>
</template>

<script lang="js">
export default {
    data() {
        return {
            from: '',
            icon: {
                complaint: 'wait-deal',
                create: 'success',
                continue: 'success',
                update: 'success',
                disContinue: 'repel',
                refund: 'refund'
            },
            title: {
                complaint: '我们已经收到您的反馈，将尽快进行审核',
                create: '合同已发送，等待对方确认',
                continue: '学员续费操作成功',
                update: '学员信息修改成功',
                disContinue: '操作成功',
                refund: '请加强教学管理，勿忘初心'
            },
            subTitle: {
                complaint: '审核结果您可以在 “消息通知”-“申/投诉处理”中进行查看',
                create: '',
                continue: '详细信息可在“学员详情”中查看',
                update: '详细信息可在“学员详情”中查看',
                disContinue: '该账户已被清退处理',
                refund: '该学员的账户将被清空处理'
            }
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
        this.from = option?.from ?? ''
    },
    methods: {
        back() {
            uni.navigateBack({ delta: 1 })
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #fff;
    text-align: center;
    .icon {
        width: 118rpx;
        height: 118rpx;
        margin-top: 212rpx;
        margin-bottom: 80rpx;
    }
    &.disContinue,
    &.refund {
        .icon {
            width: 176rpx;
            height: 176rpx;
            margin-bottom: 36rpx;
        }
    }
    .title {
        font-size: 32rpx;
        font-weight: 600;
        color: #141f33;
        line-height: 44rpx;
        margin-bottom: 36rpx;
    }
    .sub-title {
        font-size: 24rpx;
        color: #141f33;
        line-height: 34rpx;
    }
    .btn {
        position: fixed;
        bottom: 200rpx;
        background: #e2f3ff;
        border-radius: 12rpx;

        padding: 14rpx 76rpx 18rpx;

        font-size: 32rpx;
        font-weight: 500;
        color: #62bbec;
        line-height: 44rpx;
        margin: 0 230rpx;
        &::after {
            display: none;
        }
    }
}
</style>
