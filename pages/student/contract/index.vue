<template>
    <view class="page">
        <view class="page-content">
            <view class="block">
                <view class="title">一、合同双方信息</view>
                <view class="content">
                    <view class="row flex">
                        <text class="row-label">甲方：</text>
                        <text class="flex-1 text-underline">钢琴童话（上海兴心教育科技有限公司）</text>
                    </view>
                    <view class="row flex justify-between">
                        <view class="row inline-flex">
                            <text class="row-label">乙方：</text>
                            <text class="text-underline px-8">{{ form.studentName }}</text>
                        </view>
                        <view class="row t0 inline-flex">
                            <text class="row-label">监护人联系方式：</text>
                            <text class="text-underline px-8">{{ form.phone }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="block">
                <view class="title">二、签约课程信息</view>
                <view class="content">
                    <view class="row">{{ form.packageName }}</view>
                    <view v-for="course in form.courses" :key="course.id" class="row">
                        {{
                            course.courseName + course.courseNum + '节 ' + course.teacherName + ' 周' + WEEK_DAY[course.dayOfWeek] + ' ' + course.timetablePeriodName
                        }}
                    </view>
                    <view class="row">{{ '账户有效期：' + form.expiryMonths + '个月' }}</view>
                </view>
            </view>
            <view class="block">
                <view class="title">三、甲方权责</view>
                <view class="content">
                    <view class="row flex">1. 甲方需提供合格经过培训的专业教师以保证教学质量。</view>
                    <view class="row flex">2. 甲方必须为乙方提供专业的学习场所用于开展学习服务。</view>
                    <view class="row flex">3. 甲方需为乙方建立学员学习记录档案并反馈学员学习状况。</view>
                </view>
            </view>
            <view class="block">
                <view class="title">四、乙方权责</view>
                <view class="content">
                    <view class="row flex">1. 若乙方因个人原因请假或缺席，需至少提前2小时告知甲方，若无故缺席、迟到等行为，甲方有权利扣除相应课时。</view>
                    <view class="row flex">2. 若因乙方之原因(如迟到，缺勤，未按时完成作业，不配合教学计划等)致使学习目的无法完成，则甲方不承担任何责任。</view>
                    <view
                        class="row flex"
                    >3. 乙方购买的课时，需在相应有效期内使用完毕，若因个人原因导致课时沉余，甲方有权利针对过期课时进行等价折课或抵扣券等操作。</view>
                    <view class="row flex">4. 为保证乙方安全，上下学及上课过程须由家长或其监护人接送，甲方不负责由此产生的一切意外事故。</view>
                    <view
                        class="row bold flex"
                    >5. 甲方提供的内部教材，学习资料及配套物料等，仅限乙方本人使用，乙方不得擅自将内部资料告知或借阅他人使用，如乙方违反本条约定，甲方有权当即终止本协议。</view>
                </view>
            </view>
            <view class="block">
                <view class="title">五、合同解除</view>
                <view class="content">
                    <view
                        class="row flex"
                    >开课后，乙方因个人原因退学，可向甲方提出申请解除本合同，经甲方同意后，甲方有权扣除剩余课程费用的30%作为违约金，甲方扣除乙方违约金和已完成的课程费用后，在15个工作日内将剩余费用退还给乙方，如乙方已领取的教材和资料等其他用品可归还甲方或按照原价等价扣除。</view>
                </view>
            </view>
        </view>
        <view class="page-footer">
            <view class="agree" @click="disabled = !disabled">
                <image :src="`/static/images/student/icon-radio${disabled ? '' : '-active'}.png`" />
                <text class="text">我已阅读上述条款并同意签署</text>
                <text class="text xieyi">《钢琴童话教育培训协议》</text>
            </view>
            <button
                class="btn"
                :class="{ confirm: !disabled, disabled }"
                :disabled="disabled"
                @click="submit"
            >确认</button>
        </view>
    </view>
</template>

<script>
import { WEEK_DAY } from '@/utils/format'
export default {
    data() {
        return {
            WEEK_DAY,
            disabled: true,
            form: {},
            contractId: 0
        }
    },
    onLoad() {
        const contract = uni.getStorageSync('contract')
        if (!contract) {
            uni.showToast({ title: '合同不存在！', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        const contractInfo = JSON.parse(contract)
        this.form = contractInfo.contractType === 'ACCOUNT' ? contractInfo.accountContract : contractInfo.continueContract
        this.contractId = contractInfo.id
    },
    methods: {
        submit() {
            const that = this
            const coverUrl = uni.getStorageSync('coverUrl')
            if (coverUrl) {
                return this.confirm(coverUrl)
            }
            wx.getUserProfile({
                desc: '完善用户信息',
                success: res => {
                    const { avatarUrl } = res.userInfo
                    that.confirm(avatarUrl)
                },
                fail: (err) => {
                    console.log(err)
                }
            })
        },

        async confirm(coverUrl) {
            if (this.loading) return
            this.loading = true
            const data = {
                data: {
                    contractId: this.contractId,
                    coverUrl
                }
            }
            try {
                await this.$http.post('/mini/studentContract/confirmContract', data)
                this.$toast({ title: '确认成功！', icon: 'success' })
                uni.redirectTo({ url: '/pages/student/videos/index' })
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    padding-bottom: 204rpx;
    &-content {
        padding: 28rpx 52rpx;
        .block {
            + .block {
                margin-top: 36rpx;
            }

            .title {
                font-size: 24rpx;
                font-weight: 600;
                color: #141f33;
                line-height: 34rpx;
                margin-bottom: 14rpx;
            }
            .content {
                padding-left: 52rpx;
                .row {
                    font-size: 20rpx;
                    font-family: PingFangSC-Light, PingFang SC;
                    font-weight: 300;
                    color: #141f33;
                    line-height: 28rpx;
                    + .row {
                        margin-top: 12rpx;
                    }
                    &.t0 {
                        margin-top: 0;
                    }
                    &.bold {
                        font-weight: 500;
                    }
                    .row-label {
                        min-width: 68rpx;
                    }
                }
            }
        }
    }
    &-footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        padding: 30rpx 52rpx 40rpx;
        background-color: #fff;
        .agree {
            margin-bottom: 12px;
            display: flex;
            justify-content: center;
            image {
                width: 24rpx;
                height: 24rpx;
                margin-right: 16rpx;
            }
            .text {
                font-size: 24rpx; // 设计稿20rpx
                font-weight: 600;
                color: #141f33;
                line-height: 28rpx;
                &.xieyi {
                    color: #62bbec;
                }
            }
        }
        .btn {
            height: 84rpx;
            line-height: 84rpx;
            border-radius: 84rpx;
            font-size: 28rpx;
            &::after {
                display: none;
            }
            &.disabled {
                background: #e1e1e1;
                color: #99a0ad;
            }
            &.confirm {
                background: #e1e1e1
                    linear-gradient(90deg, #61baec 0%, #84daee 100%);
                color: #fff;
            }
        }
    }
}
</style>
