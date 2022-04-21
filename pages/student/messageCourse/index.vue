<template>
    <view class="page">
        <view v-for="item in records" :key="item.id" class="record">
            <view class="record-title">
                <text class="name">{{ msgType[item.msgType] }}</text>
                <text class="date">{{ weekOrDateTime(item.createTime) }}</text>
            </view>
            <view class="record-content">
                <template v-if="item.msgData">
                    <template v-if="item.msgType === 'accountExpiry'">
                        <template v-if="item.msgData.expiryDays > 0">
                            距离您的账户有效期还剩余
                            <text class="warning">{{ ' ' + item.msgData.expiryDays + ' ' }}</text>天
                        </template>
                        <template v-else>
                            您的账户已到期
                        </template>
                        ，为保证课程连续性，请尽快联系店长续费噢~
                    </template>
                    <template
                        v-else-if="item.msgType === 'useTrainTicket'"
                    >您有一张{{ item.msgData.ticketName }}于{{ dayjsFormat(item.msgData.useTime, 'MM月DD日hh:mm') }}被{{ item.msgData.teacherName }}老师核销。</template>
                    <template v-else-if="item.msgType === 'courseRemain'">
                        {{ item.msgData.courseName }}仅剩余
                        <text class="warning">{{ ' ' + item.msgData.remainCourseNum + ' ' }}</text>节，为保证课程连续性，请尽快联系店长续费噢~
                    </template>
                </template>
            </view>
        </view>
    </view>
</template>

<script>
import { msgType } from '@/utils/dicts'
import { dayjsFormat, weekOrDateTime } from "@/utils/format"
export default {
    data() {
        return {
            msgType,
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
        dayjsFormat,
        weekOrDateTime,
        async init() {
            try {
                const res = await this.$http.post('/mini/studentMsg/listCourseMsg')
                this.records = res.data?.map(item => {
                    const {
                        msgData,
                        ...rest
                    } = item
                    return {
                        ...rest,
                        msgData: msgData ? JSON.parse(msgData) : null
                    }
                }) ?? []
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
                font-weight: 600; // 设计稿 500
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
            color: #99a0ad;
            line-height: 34rpx;
            .warning {
                color: #f15e5e;
                font-weight: 600;
            }
        }
    }
}
</style>
