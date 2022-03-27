<template>
    <view class="page">
        <view v-for="item in records" :key="item.id" class="record">
            <view class="content">
                <view class="title">
                    <view>
                        <text v-if="!item.haveRead" class="dot"></text>
                        <text class="name">钢琴童话教育培训协议</text>
                    </view>
                    <text class="date">{{ weekOrDateTime(item.createTime) }}</text>
                </view>
                <view class="main">
                    <view class="info ellipsis">签约课程：{{ item.accountContract.packageName }}</view>
                    <view class="info">
                        课时详情：
                        <text
                            v-for="course in item.accountContract.courses"
                            :key="course.courseId"
                        >{{ course.courseName }}；</text>
                    </view>
                </view>
            </view>
            <view class="action">
                <text
                    class="confirmFlag"
                    :class="{ confirm: item.confirmFlag }"
                >{{ item.confirmFlag ? '已开通' : '待确认' }}</text>
                <view class="btn" @click="toContract(item)">
                    查看详情
                </view>
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
                const res = await this.$http.get('/mini/studentContract/listStudentContract')
                this.records = res.data ?? []
            } catch (error) {

            }
        },

        toContract(item) {
            uni.setStorageSync('contract', JSON.stringify(item.accountContract))
            uni.navigateTo({ url: '/pages/audition/contract/index?from=message' })
        }
    },
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #F5F7FA;
    padding-top: 48rpx;
    .record {
        background: #FFFFFF;
        border-radius: 20rpx;
        margin: 0 30rpx;
        +.record {
            margin-top: 48rpx;
        }
        .content {
            padding: 14rpx 30rpx;
            border-bottom: 2rpx solid #F5F7FA;
        }
        .title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16rpx;
            .dot {
                display: inline-block;
                width: 16rpx;
                height: 16rpx;
                background: #F15E5E;
                border-radius: 50%;
                margin-right: 16rpx;
            }
            .name {
                font-size: 28rpx;
                font-weight: 500;
                color: #141F33;
                line-height: 40rpx;
            }
            .date {
                font-size: 24rpx;
                color: #99A0AD;
            }
        }
        .main {
            .info {
                font-size: 24rpx;
                color: #99A0AD;
                line-height: 34rpx;
                +.info {
                    margin-top: 16rpx;
                }
            }
        }
        .action {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10rpx 30rpx;
            .confirmFlag {
                font-size: 24rpx;
                color: #F15E5E;
                line-height: 34rpx;
                &.confirm {
                    color: #3EB156;
                }
            }
            .btn  {
                border-radius: 8rpx;
                border: 2rpx solid #61BAEC;
                padding: 6rpx 16rpx;
                font-size: 22rpx;
                color: #62BBEC;
                line-height: 32rpx;
            }
        }
    }
}
</style>
