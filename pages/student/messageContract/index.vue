<template>
    <view class="page">
        <view v-for="item in records" :key="item.id" class="record">
            <view class="content">
                <view class="title">
                    <view>
                        <text v-if="!item.haveRead" class="dot"></text>
                        <text class="name">钢琴童话教育培训协议</text>
                    </view>
                    <text class="date">{{ todayOrYesterdayOrDateFormat(item.createTime) }}</text>
                </view>
                <view class="main">
                    <view
                        class="info ellipsis"
                    >签约课程：{{ item.contractType === 'ACCOUNT' ? item.accountContract.packageName : item.continueContract.packageName }}</view>
                    <view class="info">
                        课时详情：
                        <template v-if="item.contractType === 'ACCOUNT'">
                            <text
                                v-for="(course, index) in item.accountContract.courses"
                                :key="course.courseId"
                            >
                                {{ course.courseName }}{{ course.courseNum }}节
                                <template
                                    v-if="index < item.accountContract.courses.length - 1"
                                >；</template>
                            </text>
                        </template>
                        <template v-else>
                            <text
                                v-for="(course, index) in item.continueContract.courses"
                                :key="course.courseId"
                            >
                                {{ course.courseName }}{{ course.courseNum }}节
                                <template
                                    v-if="index < item.continueContract.courses.length - 1"
                                >；</template>
                            </text>
                        </template>
                    </view>
                </view>
            </view>
            <view class="action">
                <text
                    class="confirmFlag"
                    :class="{ confirm: item.confirmFlag }"
                >{{ item.confirmFlag ? '已开通' : '待确认' }}</text>
                <view class="btn" @click="toContract(item)">查看详情</view>
            </view>
        </view>
    </view>
</template>

<script>
import { todayOrYesterdayOrDateFormat } from "@/utils/format"
export default {
    data() {
        return {
            records: [],
            showed: false
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
    onShow() {
        if (this.showed) this.init()
        this.showed = true
    },
    methods: {
        todayOrYesterdayOrDateFormat,
        async init() {
            try {
                const res = await this.$http.get('/mini/studentContract/listStudentContract')
                this.records = res.data ?? []
            } catch (error) {

            }
        },

        toContract(item) {
            const contract = item.contractType === 'ACCOUNT' ? item.accountContract : item.continueContract
            uni.setStorageSync('contract', JSON.stringify(contract))
            uni.navigateTo({ url: '/pages/audition/contract/index?from=message' + item.contractType + '&contractId=' + item.id })
        }
    },
}
</script>

<style lang="scss" scoped>
.page {
    min-height: 100vh;
    background: #f5f7fa;
    padding-top: 48rpx;
    .record {
        background: #ffffff;
        border-radius: 20rpx;
        margin: 0 30rpx;
        + .record {
            margin-top: 48rpx;
        }
        .content {
            padding: 14rpx 30rpx;
            border-bottom: 2rpx solid #f5f7fa;
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
                background: #f15e5e;
                border-radius: 50%;
                margin-right: 16rpx;
            }
            .name {
                font-size: 28rpx;
                font-weight: 600;
                color: #141f33;
                line-height: 40rpx;
            }
            .date {
                font-size: 24rpx;
                color: #99a0ad;
            }
        }
        .main {
            .info {
                font-size: 24rpx;
                color: #99a0ad;
                line-height: 34rpx;
                + .info {
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
                color: #f15e5e;
                line-height: 34rpx;
                &.confirm {
                    color: #3eb156;
                }
            }
            .btn {
                border-radius: 8rpx;
                border: 2rpx solid #61baec;
                padding: 6rpx 16rpx;
                font-size: 22rpx;
                color: #62bbec;
                line-height: 32rpx;
            }
        }
    }
}
</style>
