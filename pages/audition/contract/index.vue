<template>
    <view class="page" :class="{ hasBtn }">
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

                    <template v-if="['messageCONTINUE', 'continue'].includes(from)">
                        <view v-if="form.trainTicket" class="row">
                            {{
                                form.trainTicket.ticketName + ' ' + form.trainTicket.num + '张'
                            }}
                        </view>
                        <view class="row">* {{ form.immediately ? '立即生效' : '剩余课时结束后生效课程' }}</view>
                    </template>
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
            <view
                v-if="['messageACCOUNT', 'messageCONTINUE', 'refund'].includes(from)"
                class="message"
            >
                <view class="explain">* 最终解释权归甲方所有</view>
                <view class="divider"></view>
                <view class="hasRead">监护人已阅读并同意此协议</view>
            </view>
        </view>
        <view v-if="hasBtn" class="page-footer">
            <button class="btn-primary" type="primary" @click="handleSubmit">确认无误，发送合同</button>
        </view>
    </view>
</template>

<script>
import { WEEK_DAY } from '@/utils/format'
export default {
    data() {
        return {
            WEEK_DAY,
            form: {},
            from: ''
        }
    },
    computed: {
        hasBtn() {
            return !this.from || this.from === 'continue'
        }
    },
    onLoad(option) {
        const token = uni.getStorageSync('token')
        const contract = uni.getStorageSync('contract')

        // 权限验证
        if (!token) {
            uni.showToast({ title: '请先登录', icon: 'none' })
            return uni.navigateTo({ url: '/pages/login/index' })
        }
        if (!contract) {
            uni.showToast({ title: '合同不存在请重新录入！', icon: 'none' })
            return uni.navigateBack({ delta: 1 })
        }
        if (option?.from) {
            this.from = option.from
        }
        this.form = JSON.parse(contract)
    },
    methods: {
        async handleSubmit() {
            if (this.loading) return
            this.loading = true
            uni.showLoading({ title: '保存中', mask: true })

            if (this.from === 'continue') {
                this.continue()
            } else {
                this.create()
            }
        },

        async create() {
            const {
                studentName,
                phone,
                gender,
                birthday,
                packageId,
                expiryMonths,
                courses,
                basicStudyDays,
                basicStudyChapters,
            } = this.form
            const data = {
                data: {
                    basicStudyChapters,
                    basicStudyDays,
                    birthday,
                    courses,
                    expiryMonths,
                    gender,
                    packageId,
                    phone,
                    studentName
                }
            }
            try {
                await this.$http.post('/mini/student/addStudent', data)
                this.$toast({ title: '账号开通成功！', icon: 'success' })
                uni.redirectTo({ url: '/pages/success/index?from=create' })
            } finally {
                this.loading = false
                uni.hideLoading()
            }
        },

        async continue() {
            const {
                courses,
                expiryMonths,
                groupId,
                immediately,
                packageId,
                studentId,
                studentPackageId,
                trainTicket
            } = this.form
            const data = {
                data: {
                    courses: courses.map(item => ({
                        courseId: item.courseId,
                        courseNum: item.courseNum,
                        teacherId: item.teacherId,
                        timetableId: item.timetableId,
                        timetablePeriodId: item.timetablePeriodId
                    })),
                    expiryMonths,
                    groupId,
                    immediately,
                    packageId,
                    studentId,
                    studentPackageId,
                    trainTicket
                }
            }
            try {
                await this.$http.post('/mini/student/continueStudent', data)
                this.$toast({ title: '续费成功！', icon: 'success' })

                // 续费成功后刷新续费列表个数
                const countNeedContinueStudentRes = await this.$http.post('/mini/student/countNeedContinueStudent')
                this.$store.dispatch('accountBusinessCount/setTabbarInfo', {
                    key: 'xufei',
                    count: countNeedContinueStudentRes.data ?? 0
                })
                uni.redirectTo({ url: '/pages/success/index?from=continue' })
            } finally {
                this.loading = false
                uni.hideLoading()
            }
        }
    },
    onUnload() {
        uni.removeStorageSync('contract')
    }
}
</script>

<style lang="scss" scoped>
.page {
    &.hasBtn {
        padding-bottom: 184rpx;
    }
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
        .message {
            .explain {
                font-size: 16rpx;
                font-weight: 300;
                color: #141f33;
                line-height: 22rpx;
                margin-bottom: 4rpx;
                text-align: right;
            }
            .divider {
                border-top: 2rpx dashed #99a0ad;
                margin: 10rpx 0;
            }
            .hasRead {
                font-size: 20rpx;
                font-weight: 600;
                color: #141f33;
                line-height: 28rpx;
                margin-top: 28rpx;
                text-align: right;
            }
        }
    }
    &-footer {
        position: fixed;
        width: 100%;
        bottom: 0;
        padding: 40rpx 52rpx;
        background-color: #fff;
    }
}
</style>
