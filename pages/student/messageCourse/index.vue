<template>
    <view class="page">
        <view v-for="item in records" :key="item.id" class="record">
            <view class="record-title">
                <text class="name">xxx</text>
                <text class="date">{{ weekOrDateTime(item.createTime) }}</text>
            </view>
            <view class="record-content">
                xxx
            </view>
        </view>
    </view>
</template>

<script>
import { weekOrDateTime } from "@/utils/format"
export default {
    data() {
        return {
            records: []
        }
    },
    onLoad() {
        const token = uni.getStorageSync('token')
        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        this.init()
    },
    methods: {
        weekOrDateTime,
        async init() {
            try {
                const res = await this.$http.post('/mini/studentMsg/listCourseMsg')
                this.records = res.data ?? []
            } catch (error) {

            }
        }
    },
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 48rpx 0;
    .record {
        background: #ffffff;
        border-radius: 20rpx;
        margin: 0 30rpx;
        + .record {
            margin-top: 48rpx;
        }
        &-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16rpx 30rpx;
            border-bottom: 2rpx solid #f5f7fa;
            .name {
                font-size: 28rpx;
                font-weight: 500;
                color: #141f33;
                line-height: 40rpx;
            }
            .date {
                font-size: 20rpx;
                color: #99a0ad;
            }
        }
        &-content {
            padding: 16rpx 12rpx 16rpx 30rpx;
            font-size: 24rpx;
            color: #99A0AD;
            line-height: 34rpx;
            .warning {
                color: #F15E5E;
            }
        }
    }
}
</style>
